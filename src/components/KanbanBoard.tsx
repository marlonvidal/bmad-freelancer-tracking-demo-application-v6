import { useEffect, useState, useCallback, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useApp } from '@/context/AppContext';
import type { Column } from '@/db';
import ColumnHeader from './ColumnHeader';
import AddColumnDialog from './AddColumnDialog';
import { Button } from '@/components/ui/button';

export default function KanbanBoard() {
  const { columns, reorderColumns, tasks, moveTask } = useApp();
  const [items, setItems] = useState<Column[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousTasksRef = useRef<Map<number, { columnId: number; order: number }>>(new Map());

  useEffect(() => {
    setItems(columns);
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor, {
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

  // Store task positions before drag starts
  useEffect(() => {
    const taskMap = new Map<number, { columnId: number; order: number }>();
    tasks.forEach(task => {
      if (task.id) {
        taskMap.set(task.id, { columnId: task.columnId, order: task.order ?? 0 });
      }
    });
    previousTasksRef.current = taskMap;
  }, [tasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Check if this is a column reorder or task move
    const activeIsColumn = items.some(c => c.id === active.id);
    const overIsColumn = items.some(c => c.id === over.id);

    if (activeIsColumn && overIsColumn) {
      // Column reordering
      const oldIndex = items.findIndex(c => c.id === active.id);
      const newIndex = items.findIndex(c => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setItems(newOrder);
        reorderColumns(newOrder);
      }
    } else if (!activeIsColumn && !overIsColumn) {
      // Task drag and drop
      try {
        setError(null);

        const taskId = Number(active.id);
        const targetColumnId = over.id.toString().startsWith('column-')
          ? Number(over.id.toString().replace('column-', ''))
          : Number(over.id);

        const activeTask = tasks.find(t => t.id === taskId);
        if (!activeTask) return;

        // Calculate new order: count tasks in target column
        const targetColumnTasks = tasks
          .filter(t => t.columnId === targetColumnId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const newOrder = targetColumnTasks.length;

        await moveTask(taskId, targetColumnId, newOrder);
      } catch (err: any) {
        // Store error and revert will happen automatically when tasks update
        setError(err.message || 'Failed to move task. Please try again.');
        console.error('Task drag-and-drop error:', err);
      }
    }
  }, [items, tasks, moveTask, reorderColumns]);

  return (
    <div className="flex flex-col h-full gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Add new column"
        >
          + Add Column
        </Button>
      </div>

      {error && (
        <div 
          className="p-3 bg-red-50 text-red-700 rounded border border-red-200"
          role="alert"
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(c => c.id!)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-6 overflow-x-auto pb-4" data-testid="kanban-board">
            {items.map(column => (
              <ColumnHeader key={column.id} column={column} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddColumnDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
