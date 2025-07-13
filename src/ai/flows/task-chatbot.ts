// 'use server';
/**
 * @fileOverview A chatbot for answering questions about tasks.
 *
 * - taskChatbot - A function that handles the task chatbot process.
 * - TaskChatbotInput - The input type for the taskChatbot function.
 * - TaskChatbotOutput - The return type for the taskChatbot function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot about tasks.'),
  taskList: z.string().describe('A list of tasks in JSON format.'),
});
export type TaskChatbotInput = z.infer<typeof TaskChatbotInputSchema>;

const TaskChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the tasks.'),
});
export type TaskChatbotOutput = z.infer<typeof TaskChatbotOutputSchema>;

export async function taskChatbot(input: TaskChatbotInput): Promise<TaskChatbotOutput> {
  return taskChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskChatbotPrompt',
  input: {schema: TaskChatbotInputSchema},
  output: {schema: TaskChatbotOutputSchema},
  prompt: `You are a chatbot assistant helping the user manage tasks.

  The user will provide a question about their tasks, and a list of tasks in JSON format.

  Your job is to answer the question based on the information provided in the task list.

  Here is the question: {{{question}}}

  Here is the task list:
  \`\`\`json
  {{{taskList}}}
  \`\`\`

  Answer:`,
});

const taskChatbotFlow = ai.defineFlow(
  {
    name: 'taskChatbotFlow',
    inputSchema: TaskChatbotInputSchema,
    outputSchema: TaskChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
