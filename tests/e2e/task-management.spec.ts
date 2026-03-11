import { test, expect } from '../support/fixtures/merged-fixtures';
import {
  createTask,
  createUrgentTask,
  createCompletedTask,
  createInProgressTask,
  createOverdueTask,
  createFreelancer,
} from '../support/factories';
import {
  seedTasks,
  seedFreelancers,
  clearAppData,
  getTasksFromStorage,
} from '../support/helpers/local-storage';

/**
 * Task Management E2E tests.
 * Validates the data layer (localStorage) integration patterns.
 * These tests serve as the foundation for full UI assertions once
 * the Kanban board and task management UI is implemented (stories 1.3–1.5).
 */
test.describe('Task Management — Data Layer', () => {
  test('[P1] should seed tasks into localStorage before navigation', async ({ page }) => {
    // Given tasks exist in local storage
    const tasks = [
      createTask({ title: 'Design wireframes', status: 'todo' }),
      createTask({ title: 'Implement API', status: 'in-progress' }),
      createCompletedTask({ title: 'Write tests' }),
    ];
    await seedTasks(page, tasks);

    // When the app loads
    await page.goto('/');

    // Then the app is accessible (foundation for future task UI assertions)
    await expect(page.getByRole('heading', { name: 'Freelancer Tracking App' })).toBeVisible();

    // And the tasks are persisted in storage
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(3);
    expect(storedTasks[0].title).toBe('Design wireframes');
  });

  test('[P1] should support urgent task factory for priority scenarios', async ({ urgentTask, page }) => {
    // Given an urgent task is seeded
    await seedTasks(page, [urgentTask]);
    await page.goto('/');

    // Then the urgent task data is available in storage
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks[0].priority).toBe('urgent');
    expect(storedTasks[0].status).toBe('in-progress');
  });

  test('[P1] should seed freelancers into localStorage', async ({ page }) => {
    // Given freelancers exist in local storage
    const freelancers = [
      createFreelancer({ name: 'Alice Smith', status: 'active' }),
      createFreelancer({ name: 'Bob Jones', status: 'inactive' }),
    ];
    await seedFreelancers(page, freelancers);
    await page.goto('/');

    // Then freelancers are persisted in storage
    const storedFreelancers = await page.evaluate(() => {
      const raw = window.localStorage.getItem('freelancers');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedFreelancers).toHaveLength(2);
    expect(storedFreelancers[0].name).toBe('Alice Smith');
    expect(storedFreelancers[1].status).toBe('inactive');
  });

  test('[P1] should clear all app data from localStorage', async ({ page }) => {
    // Given tasks and freelancers are seeded
    await seedTasks(page, [createTask(), createTask()]);
    await seedFreelancers(page, [createFreelancer()]);
    await page.goto('/');

    // When app data is cleared
    await clearAppData(page);

    // Then storage is empty
    const storedTasks = await getTasksFromStorage(page);
    const storedFreelancers = await page.evaluate(() => {
      const raw = window.localStorage.getItem('freelancers');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedTasks).toHaveLength(0);
    expect(storedFreelancers).toHaveLength(0);
  });

  test('[P1] should support in-progress task factory', async ({ page }) => {
    // Given an in-progress task is seeded
    const task = createInProgressTask({ title: 'Active development task' });
    await seedTasks(page, [task]);
    await page.goto('/');

    // Then the in-progress task data is correct
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks[0].status).toBe('in-progress');
    expect(storedTasks[0].title).toBe('Active development task');
  });

  test('[P1] should support overdue task factory for deadline scenarios', async ({ page }) => {
    // Given an overdue task is seeded
    const task = createOverdueTask({ title: 'Past deadline task' });
    await seedTasks(page, [task]);
    await page.goto('/');

    // Then the overdue task has a past due date
    const storedTasks = await getTasksFromStorage(page);
    const dueDate = new Date(storedTasks[0].dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(dueDate.getTime()).toBeLessThan(today.getTime());
    expect(storedTasks[0].status).toBe('todo');
  });

  test('[P1] should seed full board state with all task statuses', async ({ page }) => {
    // Given tasks across all status columns
    const boardTasks = [
      createTask({ title: 'Backlog item', status: 'todo' }),
      createInProgressTask({ title: 'In progress item' }),
      createTask({ title: 'In review', status: 'review' }),
      createCompletedTask({ title: 'Done item' }),
    ];
    await seedTasks(page, boardTasks);
    await page.goto('/');

    // Then all tasks are in storage with correct statuses
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(4);

    const statuses = storedTasks.map((t: { status: string }) => t.status);
    expect(statuses).toContain('todo');
    expect(statuses).toContain('in-progress');
    expect(statuses).toContain('review');
    expect(statuses).toContain('done');
  });

  test('[P2] should preserve task field integrity through storage round-trip', async ({ page }) => {
    // Given a task with all fields populated
    const task = createTask({
      title: 'Full field task',
      description: 'Detailed description',
      status: 'in-progress',
      priority: 'high',
      tags: ['frontend', 'urgent'],
      estimatedHours: 8,
    });
    await seedTasks(page, [task]);
    await page.goto('/');

    // Then all fields are preserved after storage round-trip
    const storedTasks = await getTasksFromStorage(page);
    const stored = storedTasks[0];
    expect(stored.title).toBe('Full field task');
    expect(stored.description).toBe('Detailed description');
    expect(stored.status).toBe('in-progress');
    expect(stored.priority).toBe('high');
    expect(stored.tags).toEqual(['frontend', 'urgent']);
    expect(stored.estimatedHours).toBe(8);
    expect(stored.id).toBeTruthy();
    expect(stored.createdAt).toBeTruthy();
  });
});
