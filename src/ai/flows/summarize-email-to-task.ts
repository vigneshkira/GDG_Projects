'use server';
/**
 * @fileOverview Summarizes an email body into a concise task title and description.
 *
 * - summarizeEmailToTask - A function that handles the email summarization process.
 * - SummarizeEmailToTaskInput - The input type for the summarizeEmailToTask function.
 * - SummarizeEmailToTaskOutput - The return type for the summarizeEmailToTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailToTaskInputSchema = z.object({
  emailBody: z
    .string()
    .describe('The body of the email to summarize into a task.'),
});
export type SummarizeEmailToTaskInput = z.infer<typeof SummarizeEmailToTaskInputSchema>;

const SummarizeEmailToTaskOutputSchema = z.object({
  taskTitle: z.string().describe('A concise title for the task.'),
  taskDescription: z.string().describe('A detailed description of the task.'),
});
export type SummarizeEmailToTaskOutput = z.infer<typeof SummarizeEmailToTaskOutputSchema>;

export async function summarizeEmailToTask(
  input: SummarizeEmailToTaskInput
): Promise<SummarizeEmailToTaskOutput> {
  return summarizeEmailToTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailToTaskPrompt',
  input: {schema: SummarizeEmailToTaskInputSchema},
  output: {schema: SummarizeEmailToTaskOutputSchema},
  prompt: `You are an AI assistant that summarizes emails into tasks.

  Given the email body below, create a concise task title and a detailed task description.

  Email Body: {{{emailBody}}}

  Task Title:
  Task Description:`,
});

const summarizeEmailToTaskFlow = ai.defineFlow(
  {
    name: 'summarizeEmailToTaskFlow',
    inputSchema: SummarizeEmailToTaskInputSchema,
    outputSchema: SummarizeEmailToTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
