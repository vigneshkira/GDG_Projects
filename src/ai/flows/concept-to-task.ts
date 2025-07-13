'use server';
/**
 * @fileOverview Generates a task and explanation from a user-provided concept.
 *
 * - conceptToTask - A function that handles the concept-to-task generation process.
 * - ConceptToTaskInput - The input type for the conceptToTask function.
 * - ConceptToTaskOutput - The return type for the conceptToTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ConceptToTaskInputSchema = z.object({
  concept: z.string().describe('The concept the user wants to learn about and get a task for.'),
});
export type ConceptToTaskInput = z.infer<typeof ConceptToTaskInputSchema>;

export const ConceptToTaskOutputSchema = z.object({
  taskTitle: z.string().describe('A concise, actionable title for a task related to the concept.'),
  taskDescription: z.string().describe('A more detailed description of the task.'),
  explanation: z.string().describe('A clear and concise explanation of the concept.'),
});
export type ConceptToTaskOutput = z.infer<typeof ConceptToTaskOutputSchema>;

export async function conceptToTask(
  input: ConceptToTaskInput
): Promise<ConceptToTaskOutput> {
  return conceptToTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conceptToTaskPrompt',
  input: {schema: ConceptToTaskInputSchema},
  output: {schema: ConceptToTaskOutputSchema},
  prompt: `You are an AI assistant that helps users learn new things by creating actionable tasks and providing explanations.

Given the user's concept, generate:
1.  A simple, actionable task that would help someone begin to understand or apply the concept.
2.  A clear, concise explanation of the concept itself, suitable for a beginner.

Concept: {{{concept}}}
`,
});

const conceptToTaskFlow = ai.defineFlow(
  {
    name: 'conceptToTaskFlow',
    inputSchema: ConceptToTaskInputSchema,
    outputSchema: ConceptToTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
