'use client';

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import type { Task } from '@/lib/types';
import {
  getTasks,
  addTask as addTaskToDb,
  updateTask as updateTaskInDb,
  deleteTask as deleteTaskFromDb,
} from '@/lib/firestore';
import { useAuth } from './use-auth';

interface UseTasksReturn {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    addTask: (task: Omit<Task, 'id' | 'status' | 'userId'>) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    isLoaded: boolean;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      setIsLoaded(false);
      const unsubscribe = getTasks(user.uid, setTasks, () => setIsLoaded(true));
      return () => unsubscribe();
    } else {
      setTasks([]);
      setIsLoaded(true);
    }
  }, [user]);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'status' | 'userId'>) => {
    if (!user) throw new Error("User not authenticated");
    const newTask = {
      ...task,
      userId: user.uid,
      status: 'todo' as const,
    };
    await addTaskToDb(newTask);
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    await updateTaskInDb(taskId, updates);
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await deleteTaskFromDb(taskId);
  }, []);

  return { tasks, setTasks, addTask, updateTask, deleteTask, isLoaded };
};
