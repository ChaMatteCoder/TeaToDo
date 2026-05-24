import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '../../types/task';
import { formatDateKey, getNextSevenDays } from '../../utils/date';

interface NextSevenDaysProps {
  selectedDate: Date;
  tasks: Task[];
  onSelectDate: (dateKey: string) => void;
}

export function NextSevenDays({ selectedDate, tasks, onSelectDate }: NextSevenDaysProps) {
  const days = getNextSevenDays(selectedDate);
  const hasAnyTask = days.some((day) => tasks.some((task) => task.dueDate === formatDateKey(day)));

  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Próximos 7 dias</h2>
        <p className="text-sm font-semibold text-tea-700">Ver semana completa</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 xl:grid xl:grid-cols-7 xl:gap-0 xl:overflow-hidden">
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const allDayTasks = tasks.filter((task) => task.dueDate === dateKey && !task.completed);
          const dayTasks = allDayTasks.slice(0, 2);
          const moreCount = Math.max(0, allDayTasks.length - dayTasks.length);
          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className="min-w-[150px] overflow-hidden border-r border-tea-900/10 px-3 py-2 text-left last:border-r-0 transition hover:bg-tea-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25 xl:min-w-0"
            >
              <div className="mb-2 flex min-w-0 items-baseline gap-2">
                <span className="min-w-0 truncate text-sm font-semibold text-stone-500">{format(day, 'EEE', { locale: ptBR }).replace('.', '')}</span>
                <span className="shrink-0 font-display text-xl text-tea-900">{format(day, 'dd')}</span>
                {allDayTasks.length ? <span className="size-1.5 shrink-0 rounded-full bg-tea-600" /> : null}
              </div>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <p className="truncate text-xs font-medium text-stone-700" key={task.id}>
                    {task.title}
                  </p>
                ))}
                {moreCount ? <p className="text-xs font-bold text-tea-700">+{moreCount}</p> : null}
              </div>
            </button>
          );
        })}
      </div>
      {!hasAnyTask ? <p className="rounded-2xl bg-tea-50/60 px-4 py-3 text-sm text-stone-500">Sem tarefas nos próximos dias selecionados.</p> : null}
    </section>
  );
}
