import { faker } from '@faker-js/faker';

export type Subtask = {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

let orderCounter = 0;

export const createSubtask = (overrides: Partial<Subtask> = {}): Subtask => ({
  id: faker.string.uuid(),
  taskId: overrides.taskId ?? faker.string.uuid(),
  title: faker.hacker.phrase(),
  completed: false,
  order: orderCounter++,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createCompletedSubtask = (overrides: Partial<Subtask> = {}): Subtask =>
  createSubtask({ completed: true, ...overrides });

/** Create an ordered array of subtasks for a given task. */
export const createSubtasks = (taskId: string, count: number, overrides: Partial<Subtask> = {}): Subtask[] =>
  Array.from({ length: count }, (_, i) =>
    createSubtask({ taskId, order: i, ...overrides }),
  );
