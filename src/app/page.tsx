'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronsLeft,
  LayoutDashboard,
  List,
  Mail,
  MoreVertical,
  Plus,
  Bot,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { TaskListView } from '@/components/task-list-view';
import { TaskForm } from '@/components/task-form';
import { SummarizeEmailDialog } from '@/components/summarize-email-dialog';
import { TaskChatbot } from '@/components/task-chatbot';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import { Task } from '@/lib/types';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [createTaskOpen, setCreateTaskOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const { tasks, isLoaded } = useTasks();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCreateTaskOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTask(null);
    }
    setCreateTaskOpen(open);
  }

  if (loading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
         <Skeleton className="h-48 w-48 rounded-full" />
       </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-8 text-primary" />
            <span className="text-xl font-semibold font-headline">TaskFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Dialog open={createTaskOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
                    <DialogDescription>
                      {editingTask ? "Update your task details." : "Fill in the details to create a new task."}
                    </DialogDescription>
                  </DialogHeader>
                  <TaskForm
                    taskToEdit={editingTask}
                    onFinished={() => handleDialogClose(false)}
                  />
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SummarizeEmailDialog onTaskCreate={(data) => {
                  setEditingTask({
                    id: '',
                    title: data.taskTitle,
                    description: data.taskDescription,
                    priority: 'medium',
                    status: 'todo',
                    userId: user.uid,
                  });
                  setCreateTaskOpen(true);
              }} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <TaskChatbot />
          <ThemeToggle />
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
