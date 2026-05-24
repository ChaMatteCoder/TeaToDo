import { ShieldCheck } from 'lucide-react';
import type { Task } from '../../types/task';
import { formatDeadlineDate, todayKey } from '../../utils/date';

interface ImportantDeadlinesProps {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}

const priorityWeight = { high: 0, medium: 1, low: 2 };

export function ImportantDeadlines({ tasks, onOpenTask }: ImportantDeadlinesProps) {
  const today = todayKey();
  const deadlines = [...tasks]
    .filter((task) => !task.completed && task.dueDate > today)
    .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority] || `${a.dueDate} ${a.dueTime}`.localeCompare(`${b.dueDate} ${b.dueTime}`))
    .slice(0, 4);

  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Prazos importantes</h2>
        <p className="text-sm font-semibold text-tea-700">Ver todos</p>
      </div>
      <div className="space-y-3">
        {deadlines.map((task) => (
          <button type="button" onClick={() => onOpenTask(task)} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-tea-50/70" key={task.id}>
            <span className="grid size-9 place-items-center rounded-full bg-amber-100 text-amber-700">
              <ShieldCheck size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">{task.title}</p>
              <p className="text-xs text-stone-500">{task.category}</p>
            </div>
            <span className="text-sm text-stone-500">{formatDeadlineDate(task.dueDate)}</span>
          </button>
        ))}
        {!deadlines.length ? <p className="rounded-3xl bg-tea-50/60 px-5 py-8 text-center font-display text-lg text-tea-900">Sem prazos importantes por enquanto.</p> : null}
      </div>
      <div className="mt-4 rounded-2xl bg-oat/45 px-4 py-3 text-sm text-stone-600">Mantenha o foco no que move você.</div>
    </section>
  );
}
