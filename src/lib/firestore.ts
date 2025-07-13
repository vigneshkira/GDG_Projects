import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task } from './types';

const TASKS_COLLECTION = 'tasks';

// READ (real-time)
export const getTasks = (
  setTasks: (tasks: Task[]) => void,
  onLoaded: () => void
) => {
  const q = collection(db, TASKS_COLLECTION);
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasks);
      onLoaded();
    },
    (error) => {
      console.error('Error getting tasks:', error);
      onLoaded();
    }
  );
  return unsubscribe;
};

// CREATE
export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    await addDoc(collection(db, TASKS_COLLECTION), task);
  } catch (error) {
    console.error('Error adding task: ', error);
    throw error;
  }
};

// UPDATE
export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id'>>
) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error('Error updating task: ', error);
    throw error;
  }
};

// DELETE
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};

// FIND by title (for chatbot)
export const findTaskByTitle = async (title: string): Promise<Task | null> => {
    try {
        const q = query(
            collection(db, TASKS_COLLECTION),
            where('title', '==', title),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Task;
        }
        return null;
    } catch (error) {
        console.error("Error finding task by title: ", error);
        return null;
    }
}
