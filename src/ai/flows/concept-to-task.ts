'use server';
/**
 * @fileOverview Generates a task and explanation from a user-provided concept.
 *
 * - conceptToTask - A function that handles the concept-to-task generation process.
 * - ConceptToTaskInput - The input type for the conceptToTask function.
 * - ConceptToTaskOutput - The return type for the conceptToTask function.
 */

import {ai} from '@/ai/genkit';
import { ConceptToTaskInput, ConceptToTaskInputSchema, ConceptToTaskOutput, ConceptToTaskOutputSchema } from '@/lib/ai-types';


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
