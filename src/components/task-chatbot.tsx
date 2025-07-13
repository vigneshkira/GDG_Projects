'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Send, Wand2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks/use-tasks';
import { taskChatbot } from '@/ai/flows/task-chatbot';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'bot' | 'system';
  content: string;
}

export function TaskChatbot() {
  const { tasks, setTasks } = useTasks();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = newMessages.map((msg) => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const response = await taskChatbot({
        question: input,
        history,
        tasks,
      });

      const botMessage: Message = { role: 'bot', content: response.answer };
      setMessages([...newMessages, botMessage]);
      setTasks(response.tasks);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'bot',
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Bot className="mr-2 h-4 w-4" />
          Task Chatbot
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Task Chatbot</SheetTitle>
          <SheetDescription>Ask me anything about your tasks, or tell me to create or delete one.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {message.role === 'system' ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded-lg w-full justify-center">
                    <Wand2 className="w-4 h-4" />
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {message.content}
                  </div>
                )}
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-xs rounded-lg bg-muted p-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Create a task to buy milk"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
