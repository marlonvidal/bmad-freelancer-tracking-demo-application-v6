import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TaskFormSchema } from '@/db/validation';
import type { TaskFormData } from '@/db/validation';
import type { Task } from '@/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import SubtasksPanel from './SubtasksPanel';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnId: number;
  initialData?: Task;
  onTaskSaved?: () => void;
}

export default function TaskForm({
  open,
  onOpenChange,
  columnId,
  initialData,
  onTaskSaved,
}: TaskFormProps) {
  const { createTask, updateTask } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TaskFormData>(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          columnId: initialData.columnId,
          priority: initialData.priority,
          tags: initialData.tags ? [...initialData.tags] : [],
          dueDate: initialData.dueDate || '',
        }
      : {
          title: '',
          description: '',
          columnId,
          priority: 'Medium',
          tags: [],
          dueDate: '',
        }
  );

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form data first
      let validated: TaskFormData;
      try {
        validated = TaskFormSchema.parse(formData);
      } catch (validationErr: any) {
        const newErrors: Record<string, string> = {};
        
        console.error('Validation error:', validationErr);
        
        // Handle Zod ZodError with proper type checking
        if (validationErr?.errors && Array.isArray(validationErr.errors)) {
          validationErr.errors.forEach((e: any) => {
            const fieldName = String(e.path?.[0] || 'form');
            const message = String(e.message || 'Invalid field');
            newErrors[fieldName] = message;
          });
        } else if (validationErr?.message) {
          newErrors.submit = String(validationErr.message);
        } else {
          newErrors.submit = 'Validation failed - please check your input';
        }
        
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Create/Update task
      try {
        if (initialData?.id) {
          await updateTask(initialData.id, validated);
        } else {
          await createTask(columnId, validated);
        }

        setFormData({
          title: '',
          description: '',
          columnId,
          priority: 'Medium',
          tags: [],
          dueDate: '',
        });

        onTaskSaved?.();
        onOpenChange(false);
      } catch (apiErr: any) {
        const errorMessage = typeof apiErr === 'string' ? apiErr : String(apiErr?.message || 'Failed to save task');
        setErrors({ submit: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof TaskFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={handleKeyDown}
        data-testid={initialData?.id ? 'task-detail-panel' : undefined}
      >
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {errors.submit && (
            <div className="text-red-600 text-sm font-semibold mb-4">{errors.submit}</div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              tabIndex={1}
              autoFocus
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('title', e.target.value)}
              placeholder="Task title"
              maxLength={255}
              aria-label="Task title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              tabIndex={2}
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('description', e.target.value)}
              placeholder="Task description (optional)"
              maxLength={2000}
              rows={4}
              aria-label="Task description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: string) => handleFieldChange('priority', value)}
              >
                <SelectTrigger id="priority" tabIndex={3} aria-label="Priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                tabIndex={4}
                type="date"
                value={formData.dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('dueDate', e.target.value)}
                aria-label="Due date"
              />
              {errors.dueDate && (
                <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              tabIndex={5}
              value={(formData.tags && formData.tags.length > 0) ? formData.tags.join(', ') : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const tagsArray = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                handleFieldChange('tags', tagsArray);
              }}
              placeholder="e.g., urgent, review, design"
              aria-label="Tags"
            />
          </div>
        </div>

        {initialData?.id && <SubtasksPanel task={initialData} />}

        <DialogFooter>
          <Button tabIndex={6} variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button tabIndex={7} onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
