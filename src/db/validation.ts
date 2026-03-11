import { z } from 'zod';

// ISO 8601 datetime string
const ISODateSchema = z.string().datetime();

export const TaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Task title is required').max(255, 'Task title must be under 255 characters'),
  description: z.string().max(2000, 'Task description must be under 2000 characters').optional(),
  columnId: z.number().positive('Column ID must be positive'),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  tags: z.array(z.string()).optional(),
  completed: z.boolean().default(false),
  clientId: z.number().positive().optional(),
  projectId: z.number().positive().optional(),
  billable: z.boolean().optional(),
  hourlyRate: z.number().positive().optional(),
  timeEstimate: z.number().positive('Time estimate must be positive').optional(),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

// Form validation schema (excludes id, createdAt, updatedAt, completed)
export const TaskFormSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completed: true,
});

export const ColumnSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Column name is required').max(255, 'Column name must be under 255 characters'),
  order: z.number().nonnegative('Column order must be non-negative'),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

export const ClientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Client name is required').max(255, 'Client name must be under 255 characters'),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  contactInfo: z.string().max(500).optional(),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

export const ProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Project name is required').max(255, 'Project name must be under 255 characters'),
  clientId: z.number().positive().optional(),
  hourlyRate: z.number().positive().optional(),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

export const TimeEntrySchema = z.object({
  id: z.number().optional(),
  taskId: z.number().positive('Task ID must be positive'),
  duration: z.number().positive('Duration must be positive'),
  note: z.string().max(500).optional(),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

export const SettingsSchema = z.object({
  id: z.number().optional(),
  key: z.string().min(1).max(255),
  value: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.any())]),
  createdAt: ISODateSchema,
  updatedAt: ISODateSchema,
});

export type ValidatedTask = z.infer<typeof TaskSchema>;
export type TaskFormData = z.infer<typeof TaskFormSchema>;
export type ValidatedColumn = z.infer<typeof ColumnSchema>;
export type ValidatedClient = z.infer<typeof ClientSchema>;
export type ValidatedProject = z.infer<typeof ProjectSchema>;
export type ValidatedTimeEntry = z.infer<typeof TimeEntrySchema>;
export type ValidatedSettings = z.infer<typeof SettingsSchema>;
