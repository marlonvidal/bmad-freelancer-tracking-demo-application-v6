import { test as base } from '@playwright/test';
import { createTask } from '../factories/task-factory';
import { createSubtask, createSubtasks, type Subtask } from '../factories/subtask-factory';
import { seedTasks, seedSubtasks } from '../helpers/local-storage';

type SubtaskFixtures = {
  /** A task with 3 pre-seeded subtasks (1 completed, 2 incomplete). */
  taskWithSubtasks: {
    taskTitle: string;
    subtasks: Subtask[];
  };
  /** A task with no subtasks. */
  taskWithoutSubtasks: {
    taskTitle: string;
  };
};

export const test = base.extend<SubtaskFixtures>({
  taskWithSubtasks: async ({ page }, use) => {
    const task = createTask({ title: 'Task with subtasks', status: 'todo' });
    const subtasks = [
      createSubtask({ taskId: task.id, title: 'Incomplete subtask 1', completed: false, order: 0 }),
      createSubtask({ taskId: task.id, title: 'Incomplete subtask 2', completed: false, order: 1 }),
      createSubtask({ taskId: task.id, title: 'Completed subtask', completed: true, order: 2 }),
    ];

    await seedTasks(page, [task]);
    await seedSubtasks(page, subtasks);

    await use({ taskTitle: task.title, subtasks });
    // No cleanup needed — each test gets a fresh browser context
  },

  taskWithoutSubtasks: async ({ page }, use) => {
    const task = createTask({ title: 'Task without subtasks', status: 'todo' });
    await seedTasks(page, [task]);
    await use({ taskTitle: task.title });
  },
});

export { expect } from '@playwright/test';
