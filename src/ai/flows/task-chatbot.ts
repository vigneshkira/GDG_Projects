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
import { Task, TaskSchema } from '@/lib/types';
import { addTask, deleteTask, findTaskByTitle } from '@/lib/firestore';

const TaskChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot about tasks.'),
  history: z.array(z.any()),
  tasks: z.array(TaskSchema),
});
export type TaskChatbotInput = z.infer<typeof TaskChatbotInputSchema>;

const TaskChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the tasks.'),
});
export type TaskChatbotOutput = z.infer<typeof TaskChatbotOutputSchema>;

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
    try {
      await addTask({ ...input, status: 'todo' });
      return `Task "${input.title}" added successfully.`;
    } catch (e) {
      return `Failed to add task "${input.title}".`;
    }
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
    try {
      const taskToDelete = await findTaskByTitle(input.title);
      if (taskToDelete) {
        await deleteTask(taskToDelete.id);
        return `Task "${input.title}" deleted successfully.`;
      }
      return `Task "${input.title}" not found.`;
    } catch (e) {
      return `Failed to delete task "${input.title}".`;
    }
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
    const { response, history } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: input.question,
      history: input.history,
      tools: [addTaskTool, deleteTaskTool],
      system: `You are a helpful assistant for managing a task list. The user can ask you to add, delete, or ask questions about their tasks. Here is the current list of tasks: ${JSON.stringify(
        input.tasks
      )}`,
    });

    const lastMessage = response.at(-1);

    if (lastMessage?.isToolResponse()) {
      const toolResponse = lastMessage.toolResponse();
      return {
        answer: toolResponse.response as string,
      };
    }

    return {
      answer: response.text ?? "I'm not sure how to respond.",
    };
  }
);
