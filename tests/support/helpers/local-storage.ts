import { type Page } from '@playwright/test';
import { type Task } from '../factories/task-factory';
import { type Freelancer } from '../factories/freelancer-factory';
import { type Subtask } from '../factories/subtask-factory';

/**
 * Seed tasks directly into localStorage (bypasses UI, fast setup).
 * The app uses localStorage as its data store.
 */
export async function seedTasks(page: Page, tasks: Task[]): Promise<void> {
  await page.addInitScript((tasksData) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasksData));
  }, tasks);
}

/**
 * Seed freelancers directly into localStorage.
 */
export async function seedFreelancers(page: Page, freelancers: Freelancer[]): Promise<void> {
  await page.addInitScript((data) => {
    window.localStorage.setItem('freelancers', JSON.stringify(data));
  }, freelancers);
}

/**
 * Seed subtasks directly into localStorage/Dexie-compatible storage (bypasses UI, fast setup).
 * Story 1.7 stores subtasks in Dexie under the 'subtasks' object store.
 * This helper seeds into the IndexedDB-compatible structure the app expects.
 */
export async function seedSubtasks(page: Page, subtasks: Subtask[]): Promise<void> {
  await page.addInitScript((subtasksData) => {
    // Seed into localStorage as a fallback/init hint.
    window.localStorage.setItem('__seed_subtasks__', JSON.stringify(subtasksData));

    // Open Dexie's IndexedDB store and seed subtasks directly.
    // Use version 2 (added subtasks store in story 1.7).
    const request = indexedDB.open('FreelancerTrackerDB', 2);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('subtasks')) return;
      const tx = db.transaction('subtasks', 'readwrite');
      const store = tx.objectStore('subtasks');
      subtasksData.forEach((subtask: typeof subtasksData[number]) => store.put(subtask));
    };
  }, subtasks);
}

/**
 * Clear all app data from localStorage and IndexedDB.
 */
export async function clearAppData(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.localStorage.clear();
    indexedDB.deleteDatabase('freelancerAppDB');
  });
}

/**
 * Read tasks from localStorage (for assertions).
 */
export async function getTasksFromStorage(page: Page): Promise<Task[]> {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem('tasks');
    return raw ? JSON.parse(raw) : [];
  });
}

/**
 * Read subtasks from Dexie/IndexedDB (for assertions).
 */
export async function getSubtasksFromStorage(page: Page): Promise<Subtask[]> {
  return page.evaluate(() => {
    return new Promise<unknown[]>((resolve) => {
      const request = indexedDB.open('FreelancerTrackerDB', 2);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('subtasks')) {
          resolve([]);
          return;
        }
        const tx = db.transaction('subtasks', 'readonly');
        const store = tx.objectStore('subtasks');
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => resolve([]);
      };
      request.onerror = () => resolve([]);
    });
  }) as Promise<Subtask[]>;
}
