'use client';

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Minus,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import type { Priority, Status, Task } from '@/lib/types';

interface KanbanCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onEditTask: (task: Task) => void;
}

const priorityIcons: Record<Priority, React.ReactNode> = {
  low: <ChevronDown className="h-4 w-4 text-gray-500" />,
  medium: <Minus className="h-4 w-4 text-yellow-500" />,
  high: <ChevronUp className="h-4 w-4 text-red-500" />,
};

const priorityText: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function KanbanCard({ task, onStatusChange, onEditTask }: KanbanCardProps) {
  const { deleteTask } = useTasks();

  return (
    <Card className="mb-4 bg-card/70 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium leading-tight mb-1">
            {task.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTask(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <GripVertical className="mr-2 h-4 w-4" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {['todo', 'in-progress', 'done'].map((status) =>
                    task.status !== status ? (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => onStatusChange(task.id, status as Status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </DropdownMenuItem>
                    ) : null
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'capitalize flex items-center gap-1',
                task.priority === 'high' && 'border-red-500/50 text-red-500',
                task.priority === 'medium' && 'border-yellow-500/50 text-yellow-500',
                task.priority === 'low' && 'border-gray-500/50 text-gray-500'
              )}
            >
              {priorityIcons[task.priority]}
              {priorityText[task.priority]}
            </Badge>

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {task.calendarEventUrl && (
            <a href={task.calendarEventUrl} target="_blank" rel="noopener noreferrer">
              <Badge variant="secondary" className="hover:bg-accent">
                <Calendar className="mr-1 h-3 w-3" />
                Calendar Event
              </Badge>
            </a>
          )}
          {task.driveFileUrl && (
             <a href={task.driveFileUrl} target="_blank" rel="noopener noreferrer">
                <Badge variant="secondary" className="hover:bg-accent">
                    <Paperclip className="mr-1 h-3 w-3" />
                    Drive File
                </Badge>
             </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
