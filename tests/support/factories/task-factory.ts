import { faker } from '@faker-js/faker';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  createdAt: string;
};

export const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: faker.string.uuid(),
  title: faker.hacker.phrase(),
  description: faker.lorem.paragraph(),
  status: 'todo',
  priority: 'medium',
  dueDate: faker.date.future().toISOString().split('T')[0],
  tags: [faker.hacker.noun(), faker.hacker.adjective()],
  estimatedHours: faker.number.int({ min: 1, max: 40 }),
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createInProgressTask = (overrides: Partial<Task> = {}): Task =>
  createTask({ status: 'in-progress', ...overrides });

export const createCompletedTask = (overrides: Partial<Task> = {}): Task =>
  createTask({ status: 'done', ...overrides });

export const createUrgentTask = (overrides: Partial<Task> = {}): Task =>
  createTask({ priority: 'urgent', ...overrides });

export const createOverdueTask = (overrides: Partial<Task> = {}): Task =>
  createTask({
    dueDate: faker.date.past().toISOString().split('T')[0],
    status: 'todo',
    ...overrides,
  });
