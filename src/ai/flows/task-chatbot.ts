'use server';
/**
 * @fileOverview A chatbot for answering questions about tasks.
 *
 * - taskChatbot - A function that handles the task chatbot process.
 * - TaskChatbotInput - The input type for the taskChatbot function.
 * - TaskChatbotOutput - The return type for the taskChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  calendarEventUrl: z.string().url().optional(),
  driveFileUrl: z.string().url().optional(),
});
export type Task = z.infer<typeof TaskSchema>;

const TaskChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot about tasks.'),
  history: z.array(z.any()),
  tasks: z.array(TaskSchema),
});
export type TaskChatbotInput = z.infer<typeof TaskChatbotInputSchema>;

const TaskChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the tasks.'),
  tasks: z.array(TaskSchema),
  toolRequest: z.any().optional(),
  toolResponse: z.any().optional(),
});
export type TaskChatbotOutput = z.infer<typeof TaskChatbotOutputSchema>;

let tasks: Task[] = [];

const addTaskTool = ai.defineTool(
  {
    name: 'addTask',
    description: 'Add a new task to the list.',
    inputSchema: z.object({
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const newTask: Task = {
      ...input,
      id: uuidv4(),
      status: 'todo',
    };
    tasks.push(newTask);
    return `Task "${input.title}" added successfully.`;
  }
);

const deleteTaskTool = ai.defineTool(
  {
    name: 'deleteTask',
    description: 'Delete a task by its title.',
    inputSchema: z.object({
      title: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const taskToDelete = tasks.find(
      (task) => task.title.toLowerCase() === input.title.toLowerCase()
    );
    if (taskToDelete) {
      tasks = tasks.filter((task) => task.id !== taskToDelete.id);
      return `Task "${input.title}" deleted successfully.`;
    }
    return `Task "${input.title}" not found.`;
  }
);

export async function taskChatbot(input: TaskChatbotInput): Promise<TaskChatbotOutput> {
  return taskChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskChatbotPrompt',
  input: {
    schema: z.object({
      question: z.string(),
      taskList: z.string(),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string(),
    }),
  },
  prompt: `You are a chatbot assistant helping the user manage tasks.

  The user will provide a question about their tasks, and a list of tasks in JSON format.

  Your job is to answer the question based on the information provided in the task list.
  If you use a tool, provide a brief acknowledgement of the action taken in your answer.

  Here is the question: {{{question}}}

  Here is the task list:
  \`\`\`json
  {{{taskList}}}
  \`\`\`

  Answer:`,
  tools: [addTaskTool, deleteTaskTool],
});

const taskChatbotFlow = ai.defineFlow(
  {
    name: 'taskChatbotFlow',
    inputSchema: TaskChatbotInputSchema,
    outputSchema: TaskChatbotOutputSchema,
  },
  async (input) => {
    tasks = input.tasks;
    const { history, stream } = ai.generateStream({
      model: 'googleai/gemini-2.0-flash',
      prompt: {
        system: `You are a helpful assistant that can manage a user's tasks. You can add tasks and delete tasks. You can also answer questions about the tasks.`,
        messages: input.history,
      },
      history: input.history,
      tools: [addTaskTool, deleteTaskTool],
      context: {
        tasks,
      },
    });

    for await (const chunk of stream) {
      if (chunk.isToolRequest()) {
        const toolResponse = await chunk.toolRequest!.run();
        return {
          answer: toolResponse.response as string,
          tasks,
          toolRequest: chunk.toolRequest,
          toolResponse,
        };
      }
    }
    const response = await history;
    const lastMessage = response.at(-1);

    return {
      answer: lastMessage?.content[0].text ?? "I'm not sure how to respond.",
      tasks,
    };
  }
);
