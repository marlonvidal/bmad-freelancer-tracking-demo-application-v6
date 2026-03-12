import { faker } from '@faker-js/faker';
import { Task } from '@/schemas/task';

/**
 * Task Data Factory
 * 
 * Generates realistic test task data using @faker-js/faker
 * Supports overrides for specific test scenarios
 */

export function createTask(columnId: number = 1, overrides?: Partial<Task>): Task {
  return {
    title: faker.lorem.sentence({ min: 3, max: 10 }).replace(/\.$/, ''),
    description: faker.lorem.paragraph(),
    columnId,
    priority: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Urgent']),
    tags: [faker.lorem.word(), faker.lorem.word()],
    dueDate: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
    order: 0,
    completed: false,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Create multiple tasks with sequential order values
 */
export function createTasks(count: number, columnId: number = 1): Task[] {
  return Array.from({ length: count }, (_, i) =>
    createTask(columnId, { order: i }),
  );
}

/**
 * Create a task with minimal required fields (for lightweight tests)
 */
export function createMinimalTask(columnId: number = 1, overrides?: Partial<Task>): Task {
  return {
    title: faker.lorem.sentence(),
    columnId,
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 0,
    ...overrides,
  };
}

/**
 * Create a task with all fields filled (for comprehensive tests)
 */
export function createFullTask(columnId: number = 1, overrides?: Partial<Task>): Task {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(2),
    columnId,
    priority: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Urgent']),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      faker.lorem.word(),
    ),
    dueDate: faker.date.soon({ days: 60 }).toISOString().split('T')[0],
    order: 0,
    completed: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}
