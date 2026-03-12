import { faker } from '@faker-js/faker';

/**
 * Column Schema (Dexie)
 */
export interface Column {
  id?: number;
  name: string;
  order: number;
  createdAt: string;
}

/**
 * Column Factory
 * 
 * Creates realistic column data for kanban board tests.
 */

interface ColumnOverrides {
  id?: number;
  name?: string;
  order?: number;
  createdAt?: string;
}

let columnIdCounter = 1;

const defaultColumnNames = [
  'To Do',
  'In Progress',
  'In Review',
  'Done',
  'Backlog',
  'On Hold',
];

/**
 * Create a single column with optional overrides
 * @param overrides - Partial column properties to override defaults
 * @returns Column object
 */
export function createColumn(overrides?: ColumnOverrides): Column {
  const baseId = columnIdCounter++;

  return {
    id: overrides?.id ?? baseId,
    name:
      overrides?.name ??
      defaultColumnNames[baseId % defaultColumnNames.length],
    order: overrides?.order ?? baseId - 1,
    createdAt: overrides?.createdAt ?? faker.date.past().toISOString(),
  };
}

/**
 * Create multiple columns with optional overrides
 * @param count - Number of columns to create
 * @param overrides - Partial column properties applied to all created columns
 * @returns Array of Column objects
 */
export function createColumns(count: number, overrides?: ColumnOverrides): Column[] {
  const columns: Column[] = [];

  for (let i = 0; i < count; i++) {
    const column = createColumn({
      ...overrides,
      order: overrides?.order !== undefined ? overrides.order + i : i,
    });
    columns.push(column);
  }

  return columns;
}

/**
 * Create standard kanban columns (To Do, In Progress, Done)
 * @returns Array of 3 standard columns
 */
export function createStandardKanbanColumns(): Column[] {
  return [
    createColumn({ name: 'To Do', order: 0 }),
    createColumn({ name: 'In Progress', order: 1 }),
    createColumn({ name: 'Done', order: 2 }),
  ];
}

/**
 * Reset column ID counter for test isolation
 */
export function resetColumnIdCounter(): void {
  columnIdCounter = 1;
}

/**
 * Create a custom named column
 */
export function createColumnWithName(
  name: string,
  overrides?: ColumnOverrides
): Column {
  return createColumn({
    name,
    ...overrides,
  });
}
