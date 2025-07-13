'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Status, Task } from '@/lib/types';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({
  title,
  tasks,
  status,
  onStatusChange,
  onEditTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-2 mb-2 rounded-lg bg-muted/50">
        <h3 className="font-semibold font-headline text-lg capitalize">{title}</h3>
        <span className="text-sm font-bold text-muted-foreground bg-background rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <ScrollArea className="h-[calc(100vh-18rem)] -mr-3 pr-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEditTask={onEditTask}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg text-muted-foreground">
            No tasks yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
