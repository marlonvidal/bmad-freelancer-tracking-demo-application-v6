import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import TaskCard from './TaskCard';
import type { Task } from '@/db';

interface DraggableTaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export default function DraggableTaskCard({
  task,
  onTaskUpdated,
}: DraggableTaskCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: prefersReducedMotion ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'opacity-50' : ''}
      data-testid={`task-${task.id}`}
      role="button"
      aria-label={`Drag to move task: ${task.title}`}
      aria-pressed={isDragging}
    >
      <TaskCard task={task} onTaskUpdated={onTaskUpdated} />
    </div>
  );
}
