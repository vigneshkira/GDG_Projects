'use client';

import * as React from 'react';
import { LayoutDashboard, List } from 'lucide-react';
import {
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { TaskListView } from '@/components/task-list-view';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import type { Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/app-layout';

export default function Home() {
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = React.useState(false);
  const { isLoaded } = useTasks();
  const { user, loading } = useAuth();
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCreateTaskOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTask(null);
    }
    setCreateTaskOpen(open);
  };

  return (
    <AppLayout 
      createTaskOpen={createTaskOpen} 
      handleDialogClose={handleDialogClose} 
      editingTask={editingTask} 
      setEditingTask={setEditingTask} 
      setCreateTaskOpen={setCreateTaskOpen}
    >
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full">
          {(loading || !user) ? (
             <div className="flex h-screen w-full items-center justify-center">
               <Skeleton className="h-48 w-48 rounded-full" />
             </div>
          ) : (
            <Tabs defaultValue="board" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-2xl font-bold font-headline tracking-tight">Tasks</h1>
                </div>
                <TabsList>
                  <TabsTrigger value="board">
                    <LayoutDashboard className="mr-2" />
                    Board
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="mr-2" />
                    List
                  </TabsTrigger>
                </TabsList>
              </div>

              {!isLoaded ? (
                <div className="space-y-4 mt-4">
                  <Skeleton className="h-10 w-1/4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                  </div>
                </div>
              ) : (
                <>
                  <TabsContent value="board" className="flex-grow min-h-0">
                    <KanbanBoard onEditTask={handleEditTask} />
                  </TabsContent>
                  <TabsContent value="list">
                    <TaskListView onEditTask={handleEditTask} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          )}
        </div>
      </SidebarInset>
    </AppLayout>
  );
}
