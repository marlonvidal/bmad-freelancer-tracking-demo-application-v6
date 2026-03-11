import { test, expect } from '../support/fixtures/merged-fixtures';
import { createTask, createUrgentTask, createCompletedTask } from '../support/factories';
import { seedTasks } from '../support/helpers/local-storage';

/**
 * Task Management E2E tests.
 * These tests will be expanded as the task management UI is implemented.
 * Currently validates the data layer (localStorage) integration pattern.
 */
test.describe('Task Management', () => {
  test('should seed tasks into localStorage before navigation', async ({ page }) => {
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
    const storedTasks = await page.evaluate(() => {
      const raw = window.localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedTasks).toHaveLength(3);
    expect(storedTasks[0].title).toBe('Design wireframes');
  });

  test('should support urgent task factory for priority scenarios', async ({ urgentTask, page }) => {
    // Given an urgent task is seeded
    await seedTasks(page, [urgentTask]);
    await page.goto('/');

    // Then the urgent task data is available in storage
    const storedTasks = await page.evaluate(() => {
      const raw = window.localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : [];
    });
    expect(storedTasks[0].priority).toBe('urgent');
    expect(storedTasks[0].status).toBe('in-progress');
  });
});
