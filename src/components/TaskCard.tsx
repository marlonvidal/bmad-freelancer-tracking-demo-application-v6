import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Task } from '@/db';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskSummary from './TaskSummary';

interface TaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export default function TaskCard({ task, onTaskUpdated }: TaskCardProps) {
  const { deleteTask } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(task.id!);
        onTaskUpdated?.();
      } catch (err: any) {
        alert(err.message || 'Failed to delete task');
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-200 text-gray-800 border border-gray-300';
      case 'Medium':
        return 'bg-blue-200 text-blue-800 border border-blue-300';
      case 'High':
        return 'bg-orange-200 text-orange-800 border border-orange-300';
      case 'Urgent':
        return 'bg-red-200 text-red-800 border border-red-300';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };
  const dueDateClass = isOverdue()
    ? 'text-red-600 font-semibold bg-red-50 px-2 py-1 rounded'
    : 'text-gray-500';

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-5 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        data-testid="task-card"
        onClick={() => setIsEditOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open task: ${task.title}`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsEditOpen(true); } }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold flex-1 text-gray-900">
            {task.title}
          </h3>
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={e => { e.stopPropagation(); setIsEditOpen(true); }}
              aria-label="Edit task"
              className="p-1 h-auto min-h-[44px] min-w-[44px]"
            >
              <Edit2 className="w-4 h-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={e => { e.stopPropagation(); handleDelete(); }}
              aria-label="Delete task"
              className="p-1 h-auto min-h-[44px] min-w-[44px]"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {task.dueDate && (
              <span className={`text-xs ${dueDateClass}`}>
                Due: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            )}
          </div>

          {task.tags && Array.isArray(task.tags) && task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{task.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <TaskSummary task={task} />
        </div>
      </div>

      <TaskForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        columnId={task.columnId}
        initialData={task}
        onTaskSaved={onTaskUpdated}
      />
    </>
  );
}
