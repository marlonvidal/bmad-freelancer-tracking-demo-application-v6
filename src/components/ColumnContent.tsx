import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Column } from '@/db';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColumnContentProps {
  column: Column;
}

export default function ColumnContent({ column }: ColumnContentProps) {
  const { tasks } = useApp();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const columnTasks = tasks.filter((t) => t.columnId === column.id);

  const handleTaskSaved = () => {
    setIsAddTaskOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  if (columnTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <p className="text-sm mb-3">No tasks yet</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddTaskOpen(true)}
          aria-label={`Add task to ${column.name}`}
          className="min-h-[44px] min-w-[44px]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add task
        </Button>
        <TaskForm
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          columnId={column.id!}
          onTaskSaved={handleTaskSaved}
        />
      </div>
    );
  }

  return (
    <div key={refreshKey}>
      {columnTasks.map((task) => (
        <TaskCard key={task.id} task={task} onTaskUpdated={() => {}} />
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAddTaskOpen(true)}
        className="w-full justify-start text-gray-500 hover:text-gray-700 mt-2"
        aria-label={`Add another task to ${column.name}`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add task
      </Button>
      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        columnId={column.id!}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
}
