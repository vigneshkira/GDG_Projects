'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizeEmailToTask, SummarizeEmailToTaskOutput } from '@/ai/flows/summarize-email-to-task';
import { Loader2, Mail, Sparkles } from 'lucide-react';

interface SummarizeEmailDialogProps {
  onTaskCreate: (data: SummarizeEmailToTaskOutput) => void;
}

export function SummarizeEmailDialog({ onTaskCreate }: SummarizeEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!emailBody.trim()) {
      toast({
        title: 'Error',
        description: 'Email body cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await summarizeEmailToTask({ emailBody });
      onTaskCreate(result);
      setOpen(false);
      setEmailBody('');
    } catch (error) {
      console.error('Failed to summarize email:', error);
      toast({
        title: 'Summarization Failed',
        description: 'Could not summarize the email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Mail className="mr-2 h-4 w-4" />
          Summarize Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Summarize Email to Task</DialogTitle>
          <DialogDescription>
            Paste the body of an email below to automatically generate a task.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Paste email content here..."
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={10}
        />
        <DialogFooter>
          <Button
            onClick={handleSummarize}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Summarize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
