import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
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
  const { columns, reorderColumns } = useApp();
  const [items, setItems] = useState<Column[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setItems(columns);
  }, [columns]);

  const sensors = useSensors(
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(c => c.id === active.id);
      const newIndex = items.findIndex(c => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setItems(newOrder);
        reorderColumns(newOrder);
      }
    }
  };

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
