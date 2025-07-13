export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // Storing as ISO string
  priority: Priority;
  status: Status;
  calendarEventUrl?: string;
  driveFileUrl?: string;
}
