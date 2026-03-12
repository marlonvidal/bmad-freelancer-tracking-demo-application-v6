import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useApp } from '@/context/AppContext';
import type { Column } from '@/db';
import SortableColumn from './SortableColumn';
import type { QuickAddFieldHandle } from './QuickAddField';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ColumnHeaderProps {
  column: Column;
  quickAddRef?: React.Ref<QuickAddFieldHandle>;
}

export default function ColumnHeader({ column, quickAddRef }: ColumnHeaderProps) {
  const { deleteColumn, updateColumn, tasks, moveTask } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveName = async () => {
    if (editName.trim()) {
      try {
        await updateColumn(column.id!, { name: editName.trim() });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save column name:', error);
        setEditName(column.name);
        setIsEditing(false);
      }
    } else {
      setEditName(column.name);
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = async () => {
    if (window.confirm(`Remove column "${column.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteColumn(column.id!);
      } catch (error: any) {
        console.error('Failed to remove column:', error);
        alert(error.message || 'Failed to remove column');
        setIsDeleting(false);
      }
    }
  };

  const columnTasks = tasks
    .filter(t => t.columnId === column.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTaskDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    try {
      const taskId = Number(active.id);
      const activeTask = tasks.find(t => t.id === taskId);
      if (!activeTask) return;

      // Parse target (could be a task ID or column ID)
      let targetColumnId = column.id!;
      let newOrder = 0;

      if (over.id.toString().startsWith('column-')) {
        targetColumnId = Number(over.id.toString().replace('column-', ''));
        newOrder = tasks.filter(t => t.columnId === targetColumnId).length;
      } else {
        // Dropping on another task
        const overTaskId = Number(over.id);
        const overTask = tasks.find(t => t.id === overTaskId);
        if (overTask) {
          targetColumnId = overTask.columnId;
          newOrder = overTask.order ?? 0;
        }
      }

      await moveTask(taskId, targetColumnId, newOrder);
    } catch (error) {
      console.error('Task drag-and-drop error:', error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200 p-6"
      data-testid={`column-${column.id}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
        tabIndex={0}
        role="heading"
        aria-level={3}
      >
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveName();
              }
              if (e.key === 'Escape') {
                setEditName(column.name);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-2 py-1 border border-blue-500 rounded"
            aria-label={`Edit column name: ${column.name}`}
          />
        ) : (
          <h2
            onClick={() => setIsEditing(true)}
            className="flex-1 text-lg font-semibold cursor-pointer hover:text-blue-600"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
            aria-label={`Column: ${column.name}. Click to edit.`}
          >
            {column.name}
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteColumn}
          disabled={isDeleting}
          aria-label={`Delete column: ${column.name}`}
          className="ml-2 p-2 min-h-[44px] min-w-[44px]"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleTaskDragEnd}
        >
          <SortableColumn
            column={column}
            tasks={columnTasks}
            onTaskUpdated={() => {}}
            quickAddRef={quickAddRef}
          />
        </DndContext>
      </div>
    </div>
  );
}
