import { z } from 'zod';

export const SubtaskSchema = z.object({
  id: z.number().optional(),
  taskId: z.number().positive('Task ID must be positive'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  completed: z.boolean().default(false),
  order: z.number().nonnegative().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const SubtaskFormSchema = SubtaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  order: true,
});

export type SubtaskFormData = z.infer<typeof SubtaskFormSchema>;
