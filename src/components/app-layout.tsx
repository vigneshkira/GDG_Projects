
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, Wand2, Home } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Task } from '@/lib/types';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { TaskForm } from '@/components/task-form';
import { TaskChatbot } from '@/components/task-chatbot';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  createTaskOpen?: boolean;
  handleDialogClose?: (open: boolean) => void;
  editingTask?: Task | null;
  setEditingTask?: React.Dispatch<React.SetStateAction<Task | null>>;
  setCreateTaskOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppLayout({
  children,
  createTaskOpen,
  handleDialogClose,
  editingTask,
  setEditingTask,
  setCreateTaskOpen,
}: AppLayoutProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
         <Skeleton className="h-screen w-full" />
       </div>
    );
  }

  const isTasksPage = pathname === '/';

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
            {isTasksPage && handleDialogClose && setCreateTaskOpen && (
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
                     {setEditingTask && (
                        <TaskForm
                            taskToEdit={editingTask}
                            onFinished={() => handleDialogClose(false)}
                        />
                     )}
                   </DialogContent>
                 </Dialog>
               </SidebarMenuItem>
            )}
             <SidebarMenuItem>
                <Link href="/" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/'}>
                        <span>
                            <Home />
                            <span>Tasks</span>
                        </span>
                    </SidebarMenuButton>
                </Link>
             </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/ask-ai" passHref>
                    <SidebarMenuButton asChild isActive={pathname === '/ask-ai'}>
                        <span>
                            <Wand2 />
                            <span>Ask AI</span>
                        </span>
                    </SidebarMenuButton>
                </Link>
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
      {children}
    </SidebarProvider>
  );
}
