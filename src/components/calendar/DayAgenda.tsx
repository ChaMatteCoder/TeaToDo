import { Check, Coffee, Leaf, Plus } from 'lucide-react';
import type { Task } from '../../types/task';
import { formatAgendaLabel, sortTasksByDateTime } from '../../utils/date';

interface DayAgendaProps {
  selectedDate: Date;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenTask: (task: Task) => void;
  onAddTask: () => void;
}

const priorityBar = {
  high: 'bg-tea-700',
  medium: 'bg-amber-500',
  low: 'bg-stone-400',
};

export function DayAgenda({ selectedDate, tasks, onToggleTask, onOpenTask, onAddTask }: DayAgendaProps) {
  const sorted = sortTasksByDateTime(tasks);

  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card xl:col-span-4">
      <div className="mb-4 flex items-center justify-between border-b border-tea-900/10 pb-4">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Agenda • {formatAgendaLabel(selectedDate)}</h2>
        <button type="button" onClick={onAddTask} className="text-sm font-semibold text-tea-700">
          Adicionar
        </button>
      </div>
      <div className="min-h-[318px] space-y-2">
        {sorted.map((task) => (
          <div
            className={`group grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-tea-50/80 ${task.completed ? 'opacity-55' : ''}`}
            key={task.id}
          >
            <span className={`h-8 w-1 rounded-full ${priorityBar[task.priority]}`} />
            <button
              type="button"
              aria-label={task.completed ? 'Desconcluir tarefa' : 'Concluir tarefa'}
              onClick={() => onToggleTask(task.id)}
              className={`grid size-5 place-items-center rounded-full border ${task.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 text-transparent'}`}
            >
              <Check size={13} />
            </button>
            <button type="button" onClick={() => onOpenTask(task)} className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25">
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-12 shrink-0 text-sm text-stone-500">{task.dueTime || 'Livre'}</span>
                <p className={`truncate text-sm font-semibold ${task.completed ? 'line-through' : 'text-stone-800'}`}>{task.title}</p>
              </div>
            </button>
            <span className="rounded-full bg-tea-100 px-2.5 py-1 text-[11px] font-bold text-tea-700">{task.category}</span>
          </div>
        ))}

        {!sorted.length ? (
          <div className="grid min-h-[260px] place-items-center rounded-3xl bg-tea-50/60 px-6 text-center">
            <div>
              <Leaf className="mx-auto mb-3 text-tea-500" size={28} />
              <p className="font-display text-xl leading-7 text-tea-900">Nenhuma tarefa para este dia. Que tal planejar com calma?</p>
              <button
                type="button"
                onClick={onAddTask}
                className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-tea-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Adicionar tarefa neste dia
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-oat/45 px-4 py-3 text-sm text-stone-600">
        <span className="grid size-9 place-items-center rounded-full bg-white text-tea-700">
          <Coffee size={20} />
        </span>
        Tempo para você também é produtividade.
      </div>
    </section>
  );
}
