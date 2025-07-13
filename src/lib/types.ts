import { z } from 'zod';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']),
  calendarEventUrl: z.string().url().optional(),
  driveFileUrl: z.string().url().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
