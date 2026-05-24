import { CalendarDays, Leaf } from 'lucide-react';
import type { Task } from '../types/task';
import { formatRelativeDate } from '../utils/date';

interface UpcomingTasksProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}

const priorityDot = {
  high: 'bg-tea-600',
  medium: 'bg-amber-400',
  low: 'bg-stone-400',
};

export function UpcomingTasks({ tasks, onOpenTask }: UpcomingTasksProps) {
  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card xl:col-span-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold text-tea-950">Próximas tarefas</h3>
        <CalendarDays size={18} className="text-tea-600" />
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <button
            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl text-left transition hover:bg-tea-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
            key={task.id}
            type="button"
            onClick={() => onOpenTask(task)}
          >
            <span className={`ml-1 size-2.5 rounded-full ${priorityDot[task.priority]}`} />
            <p className="truncate text-[15px] font-medium text-stone-700">{task.title}</p>
            <p className="text-sm text-stone-500">
              {formatRelativeDate(task.dueDate)} {task.dueTime}
            </p>
          </button>
        ))}

        {!tasks.length ? (
          <div className="grid min-h-[138px] place-items-center rounded-3xl bg-tea-50/60 px-5 text-center">
            <div>
              <Leaf className="mx-auto mb-2 text-tea-500" size={24} />
              <p className="font-display text-lg leading-6 text-tea-900">Sem próximas tarefas. Que tal planejar sua semana?</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
