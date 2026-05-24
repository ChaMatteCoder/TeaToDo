import { motion } from 'framer-motion';
import { Check, Clock3, Flag, Trash2 } from 'lucide-react';
import type { Task, TaskPriority } from '../types/task';
import { formatCompletedAt } from '../utils/date';

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onOpenTask: (task: Task) => void;
}

const priorityStyle: Record<TaskPriority, string> = {
  high: 'text-tea-600 fill-tea-500',
  medium: 'text-amber-500 fill-amber-400',
  low: 'text-stone-400 fill-stone-300',
};

const categoryStyles = ['bg-tea-100 text-tea-700', 'bg-amber-100 text-amber-800', 'bg-stone-200 text-stone-700', 'bg-emerald-100 text-emerald-800'];

function getCategoryStyle(category: string) {
  const seed = category.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return categoryStyles[seed % categoryStyles.length];
}

export function TaskItem({ task, onToggleTask, onRemoveTask, onOpenTask }: TaskItemProps) {
  const completedAt = formatCompletedAt(task.completedAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18, height: 0 }}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-tea-50/80"
    >
      <motion.button
        type="button"
        aria-label={task.completed ? 'Marcar como pendente' : 'Concluir tarefa'}
        onClick={() => onToggleTask(task.id)}
        className={`grid size-6 place-items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35 ${
          task.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-400 text-transparent hover:border-tea-600'
        }`}
        whileTap={{ scale: 0.86 }}
      >
        <Check size={15} strokeWidth={3} />
      </motion.button>

      <button type="button" className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25" onClick={() => onOpenTask(task)}>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className={`max-w-full truncate text-[15px] font-medium ${task.completed ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{task.title}</p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getCategoryStyle(task.category)}`}>{task.category}</span>
        </div>
        {task.description ? <p className="mt-1 max-w-[42rem] truncate text-xs text-stone-400">{task.description}</p> : null}
        {task.completed && completedAt ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-tea-600">
            <Clock3 size={12} />
            Concluída às {completedAt}
          </p>
        ) : null}
      </button>

      <div className="flex items-center gap-3">
        {task.dueTime ? <span className="hidden text-sm text-stone-500 sm:inline">{task.dueTime}</span> : null}
        <Flag size={18} className={priorityStyle[task.priority]} />
        <button
          type="button"
          onClick={() => onRemoveTask(task.id)}
          aria-label="Remover tarefa"
          className="grid size-8 place-items-center rounded-full text-stone-400 opacity-100 transition hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
