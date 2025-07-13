
'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Calendar, MessageSquare, Plus, Reply } from 'lucide-react';
import type { Task } from '@/lib/types';
import { mockNotifications } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function InboxPage() {
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = React.useState(false);
  const [prefillTask, setPrefillTask] = React.useState<Partial<Task> | undefined>(undefined);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTask(null);
      setPrefillTask(undefined);
    }
    setCreateTaskOpen(open);
  };
  
  const handleCreateTask = (notification: { content: string; }) => {
    setPrefillTask({ title: notification.content });
    setCreateTaskOpen(true);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
      case 'gmail':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z"></path><path d="m22 6-10 7L2 6"></path></svg>;
      case 'instagram':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>;
      case 'whatsapp':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-green-500"><path d="M16.75 13.96c.25.13.43.2.5.28.07.08.14.18.18.25.14.28.21.58.21.81 0 .43-.11.78-.32 1.05-.22.28-.53.48-.93.61-.4.13-.86.2-1.38.2-1.2 0-2.33-.31-3.38-.94-.95-.56-1.76-1.3-2.41-2.2-.65-.9-1.12-1.93-1.42-3.08-.3-1.15-.45-2.33-.45-3.53 0-1.45.36-2.73 1.08-3.84.72-1.1 1.7-1.92 2.94-2.46.65-.29 1.33-.43 2.05-.43.58 0 1.13.08 1.63.25.5.17.92.4 1.26.7.34.3.58.66.73 1.06s.22.82.22 1.28c0 .2-.02.38-.05.55-.03.17-.09.33-.16.48l-.05.08-.06.06c-.02.02-.04.04-.06.05-.07.05-.15.1-.24.15-.1.05-.2.09-.3.13l-.1.05c-.09.04-.18.08-.26.1s-.17.06-.25.08a.96.96 0 0 1-.27.06c-.1 0-.19,0-.27-.02l-.18-.04c-.1-.03-.2-.06-.29-.09-.1-.03-.18-.06-.27-.1-.1-.03-.18-.07-.27-.1-.1-.03-.18-.06-.26-.1s-.16-.08-.24-.12a5.3 5.3 0 0 1-2.03-1.2c-.48-.38-.88-.8-1.2-1.26-.32-.46-.56-.93-.74-1.4l-.06-.2c-.02-.07-.03-.14-.03-.2 0-.25.07-.48.2-.68.13-.2.3-.35.5-.45.2-.1.42-.15.68-.15.14 0 .28.03.4.08.13.05.25.13.36.22.11.1.2.22.28.36.08.14.13.28.15.43.07.25.03.5-.13.75l-.5 1c-.17.25-.25.48-.25.7 0 .15.04.28.11.4.07.12.18.23.32.33.14.1.3.18.48.25l.2.08c.08.03.17.05.25.07.17.04.34.06.5.06.33 0 .63-.07.9-.2l.3-.15c.16-.08.3-.15.42-.2l.45-.25c.18-.1.35-.15.5-.15s.28.04.4.1c.1.08.18.15.25.23.07.08.13.15.18.22l.08.09c.04.06.08.12.1.18z"></path></svg>;
      case 'google classroom':
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-green-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v3.5c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5v-3.5zm1.5-2.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path></svg>;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case 'important':
        return <Badge variant="destructive">Important</Badge>;
      case 'general':
        return <Badge variant="secondary">General</Badge>;
      case 'promotional':
        return <Badge variant="outline">Promotional</Badge>;
      default:
        return null;
    }
  };

  const importantNotifications = mockNotifications.filter(
    (notification) => notification.category === 'Important'
  );

  return (
    <AppLayout
      createTaskOpen={createTaskOpen}
      handleDialogClose={handleDialogClose}
      editingTask={editingTask as Task}
      setEditingTask={setEditingTask}
      setCreateTaskOpen={setCreateTaskOpen}
      prefillTask={prefillTask}
    >
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl font-bold font-headline tracking-tight">Unified Inbox</h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Showing only messages classified as "Important".
            </p>
            <div className="max-w-4xl mx-auto space-y-4">
                {importantNotifications.map((notification, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader className="p-4 flex flex-row items-start gap-4 bg-muted/50">
                            <div className="flex-shrink-0">
                                {getPlatformIcon(notification.platform)}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{notification.sender}</p>
                                    <div className="flex items-center gap-2">
                                        {getCategoryBadge(notification.category)}
                                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{notification.content}</p>
                                {notification.detectedDate && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>Detected Date: {notification.detectedDate}</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 flex justify-end gap-2">
                           <Button variant="ghost" size="sm" onClick={() => handleCreateTask(notification)}>
                               <Plus className="mr-1 h-4 w-4"/>
                               Add to Task
                           </Button>
                           <Button variant="ghost" size="sm">
                               <Reply className="mr-1 h-4 w-4"/>
                               Reply
                           </Button>
                           <Button variant="ghost" size="sm">
                               <Archive className="mr-1 h-4 w-4"/>
                               Archive
                           </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </SidebarInset>
    </AppLayout>
  )
}
