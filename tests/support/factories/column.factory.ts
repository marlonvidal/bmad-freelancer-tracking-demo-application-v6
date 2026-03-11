import { faker } from '@faker-js/faker';

/**
 * Column Data Factory for ATDD Tests
 * 
 * Generates realistic test data for Kanban board columns
 * Used with Dexie.js IndexedDB for testing
 */

export interface Column {
  id?: number;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a single column with optional overrides
 * @param overrides - Partial column object to override defaults
 * @returns Complete column object with defaults
 */
export function createColumn(overrides?: Partial<Column>): Column {
  const baseOrder = Math.floor(Math.random() * 1000);
  
  return {
    id: Math.floor(Math.random() * 999999),
    name: faker.word.noun() + ' ' + faker.word.noun(),
    order: baseOrder,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

/**
 * Create multiple columns
 * @param count - Number of columns to create
 * @param overrides - Partial column object to apply to all
 * @returns Array of column objects
 */
export function createColumns(
  count: number,
  overrides?: Partial<Column>
): Column[] {
  return Array.from({ length: count }, (_, index) =>
    createColumn({
      order: index,
      ...overrides,
    })
  );
}

/**
 * Create default board columns (as might exist after Story 1.3)
 * @returns Array of typical default columns
 */
export function createDefaultColumns(): Column[] {
  return [
    createColumn({
      id: 1,
      name: 'Backlog',
      order: 0,
    }),
    createColumn({
      id: 2,
      name: 'In Progress',
      order: 1,
    }),
    createColumn({
      id: 3,
      name: 'Review',
      order: 2,
    }),
    createColumn({
      id: 4,
      name: 'Done',
      order: 3,
    }),
  ];
}

/**
 * Column names commonly used in testing
 */
export const COMMON_COLUMN_NAMES = [
  'Backlog',
  'To Do',
  'In Progress',
  'Review',
  'QA',
  'Done',
  'Blocked',
  'High Priority',
  'Low Priority',
  'Waiting',
];

/**
 * Generate column name with uniqueness guarantee
 * @param prefix - Optional prefix for column name
 * @returns Unique column name
 */
export function generateUniqueColumnName(prefix = ''): string {
  const baseNames = COMMON_COLUMN_NAMES;
  const randomName = faker.helpers.arrayElement(baseNames);
  const timestamp = Date.now().toString().slice(-4);
  
  return prefix ? `${prefix} ${randomName} ${timestamp}` : `${randomName} ${timestamp}`;
}

/**
 * Create a column with a specific name (useful for testing)
 * @param name - Column name
 * @param order - Position in column order
 * @returns Column object
 */
export function createNamedColumn(name: string, order: number): Column {
  return createColumn({
    name,
    order,
  });
}

/**
 * Create columns for a complete kanban workflow
 * @returns Array of kanban workflow columns
 */
export function createKanbanWorkflowColumns(): Column[] {
  return [
    createNamedColumn('Backlog', 0),
    createNamedColumn('To Do', 1),
    createNamedColumn('In Progress', 2),
    createNamedColumn('Review', 3),
    createNamedColumn('Done', 4),
  ];
}
