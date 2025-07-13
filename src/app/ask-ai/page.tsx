'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { conceptToTask } from '@/ai/flows/concept-to-task';
import type { ConceptToTaskOutput } from '@/lib/ai-types';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useTasks } from '@/hooks/use-tasks';
import { Skeleton } from '@/components/ui/skeleton';

export default function AskAiPage() {
  const [concept, setConcept] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ConceptToTaskOutput | null>(null);
  const { toast } = useToast();
  const { addTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await conceptToTask({ concept });
      setResult(response);
    } catch (error) {
      console.error('Failed to get explanation from AI:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Could not get an explanation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!result) return;
    try {
      await addTask({
        title: result.taskTitle,
        description: result.taskDescription,
        priority: 'medium',
      });
      toast({
        title: 'Task Created!',
        description: `"${result.taskTitle}" has been added to your board.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <AppLayout>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2">
                    <Wand2 className="h-6 w-6" />
                    <h1 className="text-2xl font-bold font-headline tracking-tight">Ask AI</h1>
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Wand2 />
                           Learn a New Concept
                        </CardTitle>
                        <CardDescription>
                            Enter a topic or concept you want to learn about. The AI will provide an explanation and create a task to help you get started.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <Input 
                                placeholder="e.g., 'What are React Server Components?'"
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                disabled={isLoading}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Generate Explanation
                            </Button>
                        </CardFooter>
                    </form>
                 </Card>

                 {isLoading && (
                    <Card className="mt-6">
                        <CardHeader>
                          <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                 )}

                 {result && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Explanation</CardTitle>
                            <CardDescription>{result.explanation}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-muted">
                               <p className="font-bold">{result.taskTitle}</p>
                               <p className="text-sm text-muted-foreground">{result.taskDescription}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <Button onClick={handleCreateTask}>Add to My Tasks</Button>
                        </CardFooter>
                    </Card>
                 )}
            </div>
        </div>
      </SidebarInset>
    </AppLayout>
  )
}
