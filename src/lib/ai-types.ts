import { z } from 'zod';

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
