'use client';

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import type { Task } from '@/lib/types';
import {
  getTasks,
  addTask as addTaskToDb,
  updateTask as updateTaskInDb,
  deleteTask as deleteTaskFromDb,
} from '@/lib/firestore';

interface UseTasksReturn {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    addTask: (task: Omit<Task, 'id' | 'status'>) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    isLoaded: boolean;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // onSnapshot will handle real-time updates
    const unsubscribe = getTasks(setTasks, () => setIsLoaded(true));
    return () => unsubscribe();
  }, []);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'status'>) => {
    const newTask = {
      ...task,
      status: 'todo' as const,
    };
    await addTaskToDb(newTask);
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    await updateTaskInDb(taskId, updates);
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await deleteTaskFromDb(taskId);
  }, []);

  return { tasks, setTasks, addTask, updateTask, deleteTask, isLoaded };
};
