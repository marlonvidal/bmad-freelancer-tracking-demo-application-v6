import { faker } from '@faker-js/faker';
import type { Task, Column } from '@/db';

/**
 * Task Factory
 * Creates task objects with sensible defaults and optional overrides.
 * Used in tests to seed IndexedDB with consistent test data.
 */
export const createTask = (overrides: Partial<Task> = {}): Task => {
  const now = new Date().toISOString();

  return {
    id: undefined, // Dexie will auto-generate
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    columnId: 1,
    dueDate: faker.date.future().toISOString().split('T')[0],
    priority: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    tags: faker.lorem.words(3).split(' '),
    clientId: undefined,
    projectId: undefined,
    billable: faker.datatype.boolean(),
    hourlyRate: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
    timeEstimate: faker.number.int({ min: 30, max: 480 }), // in minutes
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create multiple tasks
 */
export const createTasks = (count: number, overrides: Partial<Task> = {}): Task[] => {
  return Array.from({ length: count }, () => createTask(overrides));
};

/**
 * Column Factory
 * Creates column objects with sensible defaults.
 */
export const createColumn = (overrides: Partial<Column> = {}): Column => {
  const now = new Date().toISOString();

  return {
    id: undefined,
    name: faker.lorem.word(),
    order: faker.number.int({ min: 1, max: 10 }),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Create standard kanban columns
 */
export const createStandardColumns = (): Partial<Column>[] => [
  { name: 'Backlog', order: 1 },
  { name: 'In Progress', order: 2 },
  { name: 'Review', order: 3 },
  { name: 'Done', order: 4 },
];
