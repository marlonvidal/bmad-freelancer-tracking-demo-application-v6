import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DraggableTaskCard from './DraggableTaskCard';
import TaskForm from './TaskForm';
import type { Column, Task } from '@/db';

interface SortableColumnProps {
  column: Column;
  tasks: Task[];
  onTaskUpdated?: () => void;
}

export default function SortableColumn({
  column,
  tasks,
  onTaskUpdated,
}: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const sortedTasks = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-gray-50 rounded-lg p-6 min-h-96 transition-colors relative ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'
      }`}
      data-testid={`column-${column.id}`}
    >
      {/* Drop Indicator - visible when hovering over empty column */}
      {isOver && sortedTasks.length === 0 && (
        <div
          className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none"
          data-testid="drop-indicator"
        />
      )}

      <h2 className="font-semibold text-gray-800 mb-4">{column.name}</h2>
      
      <SortableContext
        items={sortedTasks.map(t => t.id!)}
        strategy={verticalListSortingStrategy}
      >
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <p className="text-sm mb-3">No tasks yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddTaskOpen(true)}
              aria-label={`Add task to ${column.name}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add task
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Drop indicator between tasks when dragging over */}
            {isOver && (
              <div
                className="h-1 bg-blue-400 my-2 rounded transition-all"
                data-testid="drop-indicator"
              />
            )}
            {sortedTasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onTaskUpdated={onTaskUpdated}
              />
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
          </div>
        )}
      </SortableContext>

      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        columnId={column.id!}
        onTaskSaved={() => {
          setIsAddTaskOpen(false);
          onTaskUpdated?.();
        }}
      />
    </div>
  );
}
