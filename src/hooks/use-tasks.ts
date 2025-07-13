'use client';

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import type { Task } from '@/lib/types';

const STORE_KEY = 'taskflow-tasks';

interface UseTasksReturn {
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
    addTask: (task: Task) => void;
    updateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
    deleteTask: (taskId: string) => void;
    isLoaded: boolean;
}


export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage', error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  return { tasks, setTasks, addTask, updateTask, deleteTask, isLoaded };
};
