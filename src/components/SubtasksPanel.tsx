import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import type { Task } from '@/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Trash2, Plus } from 'lucide-react';

interface SubtasksPanelProps {
  task: Task;
}

export default function SubtasksPanel({ task }: SubtasksPanelProps) {
  const { subtasks, addSubtask, deleteSubtask, toggleSubtaskCompletion } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const taskSubtasks = subtasks
    .filter(s => s.taskId === task.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const completedCount = taskSubtasks.filter(s => s.completed).length;

  const handleOpenAdd = () => {
    setIsAdding(true);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAdd = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setError('Title is required');
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      await addSubtask(task.id!, trimmed);
      setNewTitle('');
      // keep isAdding open for quick sequential entry
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (err: any) {
      setError(err.message || 'Failed to save subtask. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setError(null);
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleToggle = async (subtaskId: number) => {
    try {
      setError(null);
      await toggleSubtaskCompletion(subtaskId);
    } catch (err: any) {
      setError(err.message || 'Failed to update subtask. Please try again.');
    }
  };

  const handleDeleteRequest = (subtaskId: number, subtaskTitle: string) => {
    setDeleteTarget({ id: subtaskId, title: subtaskTitle });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setError(null);
      await deleteSubtask(deleteTarget.id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete subtask. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mt-6 border-t pt-4" data-testid="subtasks-panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-800">
          Subtasks
          {taskSubtasks.length > 0 && (
            <span className="ml-2 text-gray-500 font-normal">
              ({completedCount}/{taskSubtasks.length} done)
            </span>
          )}
        </h3>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200" role="alert">
          {error}
        </div>
      )}

      {taskSubtasks.length === 0 && !isAdding && (
        <p className="text-sm text-gray-400 mb-3">No subtasks yet.</p>
      )}

      <ul className="space-y-2 mb-3" aria-label="Subtasks list">
        {taskSubtasks.map((subtask) => (
          <li
            key={subtask.id}
            className="flex items-center gap-2 group"
            data-testid="subtask-item"
          >
            <input
              type="checkbox"
              id={`subtask-${subtask.id}`}
              checked={subtask.completed}
              onChange={() => handleToggle(subtask.id!)}
              className="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              aria-label={`Toggle completion: ${subtask.title}`}
              data-testid="subtask-checkbox"
            />
            <label
              htmlFor={`subtask-${subtask.id}`}
              className={`flex-1 text-sm cursor-pointer select-none ${
                subtask.completed
                  ? 'line-through text-gray-400'
                  : 'text-gray-800'
              }`}
              data-testid="subtask-title"
            >
              {subtask.title}
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteRequest(subtask.id!, subtask.title)}
              aria-label={`Delete subtask: ${subtask.title}`}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-7 w-7 p-0 transition-opacity"
              data-testid="subtask-delete-btn"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>

      {isAdding ? (
        <div className="space-y-2">
          <Input
            ref={inputRef}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Subtask title..."
            maxLength={255}
            disabled={isSaving}
            aria-label="New subtask title"
            data-testid="subtask-input"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={isSaving} data-testid="subtask-add-confirm">
              {isSaving ? 'Adding...' : 'Add'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenAdd}
          className="w-full"
          data-testid="add-subtask-btn"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add subtask
        </Button>
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete this subtask?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed.` : undefined}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
