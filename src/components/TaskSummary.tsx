import { useApp } from '@/context/AppContext';
import type { Task } from '@/db';

interface TaskSummaryProps {
  task: Task;
}

export default function TaskSummary({ task }: TaskSummaryProps) {
  const { subtasks } = useApp();

  const taskSubtasks = subtasks.filter(s => s.taskId === task.id);
  if (taskSubtasks.length === 0) return null;

  const completedCount = taskSubtasks.filter(s => s.completed).length;
  const allDone = completedCount === taskSubtasks.length;

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        allDone
          ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700'
      }`}
      aria-label={`${completedCount} of ${taskSubtasks.length} subtasks done`}
      data-testid="subtask-summary"
    >
      {completedCount}/{taskSubtasks.length} subtasks
    </span>
  );
}
