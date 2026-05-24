import { addMonths, subMonths } from 'date-fns';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '../../types/task';
import { formatMonthYear, getMonthMatrix, todayKey } from '../../utils/date';
import { CalendarDayCell } from './CalendarDayCell';

interface MonthCalendarProps {
  monthDate: Date;
  selectedDate: string;
  tasks: Task[];
  onMonthChange: (date: Date) => void;
  onSelectDate: (dateKey: string) => void;
}

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function MonthCalendar({ monthDate, selectedDate, tasks, onMonthChange, onSelectDate }: MonthCalendarProps) {
  const days = getMonthMatrix(monthDate);

  return (
    <section className="overflow-hidden rounded-[22px] border border-tea-900/10 bg-white/82 p-3 shadow-card xl:col-span-8">
      <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => onMonthChange(subMonths(monthDate, 1))}
            className="grid size-9 place-items-center rounded-full bg-tea-50 text-stone-500 transition hover:bg-tea-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="min-w-[170px] font-display text-2xl font-semibold text-tea-950">{formatMonthYear(monthDate)}</h2>
          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() => onMonthChange(addMonths(monthDate, 1))}
            className="grid size-9 place-items-center rounded-full bg-tea-50 text-stone-500 transition hover:bg-tea-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              onMonthChange(today);
              onSelectDate(todayKey());
            }}
            className="flex h-10 items-center gap-2 rounded-full border border-tea-900/10 bg-white px-4 text-sm font-semibold text-tea-700 transition hover:bg-tea-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30"
          >
            <CalendarDays size={16} />
            Hoje
          </button>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full border border-tea-900/10 bg-white px-4 text-sm font-semibold text-stone-600"
            aria-label="Visualização atual: mês"
          >
            Mês
            <ChevronDown size={16} />
          </button>
          <button type="button" disabled className="hidden h-10 rounded-full border border-tea-900/10 bg-tea-50/50 px-4 text-sm font-semibold text-stone-300 sm:block">
            Semana
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-tea-900/10 text-center">
        {weekDays.map((day) => (
          <div className="py-3 text-sm font-semibold text-stone-500" key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 overflow-hidden rounded-b-2xl border-b border-l border-tea-900/10">
        {days.map((day) => (
          <CalendarDayCell key={day.toISOString()} day={day} monthDate={monthDate} selectedDate={selectedDate} tasks={tasks} onSelectDate={onSelectDate} />
        ))}
      </div>
    </section>
  );
}
