'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Minus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import type { Priority, Status, Task } from '@/lib/types';

interface TaskListViewProps {
  onEditTask: (task: Task) => void;
}

type SortKey = 'title' | 'priority' | 'status' | 'dueDate';
type SortDirection = 'asc' | 'dsc';

const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
const statusOrder: Record<Status, number> = { todo: 1, 'in-progress': 2, done: 3 };

const priorityIcons: Record<Priority, React.ReactNode> = {
  low: <ChevronDown className="h-4 w-4 text-gray-500" />,
  medium: <Minus className="h-4 w-4 text-yellow-500" />,
  high: <ChevronUp className="h-4 w-4 text-red-500" />,
};

export function TaskListView({ onEditTask }: TaskListViewProps) {
  const { tasks, deleteTask } = useTasks();
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'dsc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'title':
        return a.title.localeCompare(b.title) * dir;
      case 'priority':
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) * dir;
      case 'status':
        return (statusOrder[a.status] - statusOrder[b.status]) * dir;
      case 'dueDate':
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return (dateA - dateB) * dir;
      default:
        return 0;
    }
  });

  const SortableHeader = ({
    label,
    sortableKey,
  }: {
    label: string;
    sortableKey: SortKey;
  }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(sortableKey)}>
        {label}
        {sortKey === sortableKey &&
          (sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          ))}
      </Button>
    </TableHead>
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="Title" sortableKey="title" />
            <SortableHeader label="Status" sortableKey="status" />
            <SortableHeader label="Priority" sortableKey="priority" />
            <SortableHeader label="Due Date" sortableKey="dueDate" />
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {task.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                     {priorityIcons[task.priority]}
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
             <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tasks found. Create one to get started!
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
