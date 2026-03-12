import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useRef } from 'react';
import DraggableTaskCard from './DraggableTaskCard';
import QuickAddField from './QuickAddField';
import type { QuickAddFieldHandle } from './QuickAddField';
import type { Column, Task } from '@/db';

interface SortableColumnProps {
  column: Column;
  tasks: Task[];
  onTaskUpdated?: () => void;
  quickAddRef?: React.Ref<QuickAddFieldHandle>;
}

export default function SortableColumn({
  column,
  tasks,
  onTaskUpdated,
  quickAddRef,
}: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const internalRef = useRef<QuickAddFieldHandle>(null);
  const resolvedRef = quickAddRef ?? internalRef;

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
          <div className="flex flex-col items-center justify-center py-4 text-gray-500">
            <p className="text-sm mb-2">No tasks yet</p>
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
          </div>
        )}
      </SortableContext>

      <QuickAddField
        ref={resolvedRef}
        columnId={column.id!}
        onTaskCreated={onTaskUpdated}
      />
    </div>
  );
}
