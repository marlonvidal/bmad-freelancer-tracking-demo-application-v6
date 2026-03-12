import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import TaskForm from './TaskForm';

export interface QuickAddFieldHandle {
  focus: () => void;
}

interface QuickAddFieldProps {
  columnId: number;
  onTaskCreated?: () => void;
  onFocus?: () => void;
}

const QuickAddField = forwardRef<QuickAddFieldHandle, QuickAddFieldProps>(
  ({ columnId, onTaskCreated, onFocus }, ref) => {
    const { createTask } = useApp();
    const [value, setValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpandOpen, setIsExpandOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        onFocus?.();
        inputRef.current?.focus();
      },
    }));

    const handleCreate = async () => {
      const trimmed = value.trim();
      if (!trimmed) {
        setError('Title is required');
        return;
      }
      if (trimmed.length > 255) {
        setError('Title must be 255 characters or less');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        await createTask(columnId, {
          title: trimmed,
          columnId,
          priority: 'Medium',
        });
        setValue('');
        onTaskCreated?.();
        // keep focus for sequential adds
        inputRef.current?.focus();
      } catch (err: any) {
        setError(err.message || 'Failed to create task. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreate();
      }
      if (e.key === 'Escape') {
        setValue('');
        setError(null);
        inputRef.current?.blur();
      }
    };

    const handleBlur = () => {
      if (!value.trim()) {
        setValue('');
        setError(null);
      }
    };

    const handleExpand = () => {
      setError(null);
      setIsExpandOpen(true);
    };

    return (
      <div className="mt-3" data-testid={`quick-add-column-${columnId}`}>
        {error && (
          <div
            className="mb-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="flex gap-1 items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Add a task..."
            value={value}
            onChange={e => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            maxLength={255}
            aria-label="Quick add task"
            data-testid="quick-add-input"
            className="w-full text-sm"
          />
          <button
            type="button"
            onClick={handleCreate}
            aria-label="Quick add task button"
            data-testid="quick-add-btn"
            disabled={isLoading}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            tabIndex={-1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleExpand}
            aria-label="Expand to full task form"
            data-testid="quick-add-expand-btn"
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={-1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 px-1">Enter to add · Esc to cancel</p>

        <TaskForm
          open={isExpandOpen}
          onOpenChange={setIsExpandOpen}
          columnId={columnId}
          initialData={value.trim() ? { title: value.trim(), columnId, priority: 'Medium', completed: false, createdAt: '', updatedAt: '' } as any : undefined}
          onTaskSaved={() => {
            setValue('');
            onTaskCreated?.();
          }}
        />
      </div>
    );
  }
);

QuickAddField.displayName = 'QuickAddField';

export default QuickAddField;
