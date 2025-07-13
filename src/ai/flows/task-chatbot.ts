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
import { Task, TaskSchema } from '@/lib/types';

const TaskChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot about tasks.'),
  history: z.array(z.any()),
  tasks: z.array(TaskSchema),
});
export type TaskChatbotInput = z.infer<typeof TaskChatbotInputSchema>;

const TaskChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the tasks.'),
  tasks: z.array(TaskSchema),
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

const taskChatbotFlow = ai.defineFlow(
  {
    name: 'taskChatbotFlow',
    inputSchema: TaskChatbotInputSchema,
    outputSchema: TaskChatbotOutputSchema,
  },
  async (input) => {
    tasks = input.tasks;

    const { response, history } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: input.question,
      history: input.history,
      tools: [addTaskTool, deleteTaskTool],
    });

    const lastMessage = response.at(-1);

    if (lastMessage?.isToolResponse()) {
        const toolResponse = lastMessage.toolResponse();
        return {
            answer: toolResponse.response as string,
            tasks,
        }
    }

    return {
      answer: response.text ?? "I'm not sure how to respond.",
      tasks,
    };
  }
);
