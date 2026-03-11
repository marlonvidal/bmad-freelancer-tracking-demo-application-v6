import { type Page } from '@playwright/test';
import { type Task } from '../factories/task-factory';
import { type Freelancer } from '../factories/freelancer-factory';

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
 * Clear all app data from localStorage.
 */
export async function clearAppData(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.localStorage.clear();
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
