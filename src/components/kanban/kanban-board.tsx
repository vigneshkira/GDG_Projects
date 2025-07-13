'use client';

import { useTasks } from '@/hooks/use-tasks';
import type { Status, Task } from '@/lib/types';
import { KanbanColumn } from './kanban-column';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

export function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const { tasks, updateTask } = useTasks();

  const columns: { title: string; status: Status }[] = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Done', status: 'done' },
  ];

  const handleStatusChange = (taskId: string, newStatus: Status) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <ScrollArea className="w-full h-full pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks.filter((task) => task.status === col.status)}
            onStatusChange={handleStatusChange}
            onEditTask={onEditTask}
          />
        ))}
      </div>
       <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
