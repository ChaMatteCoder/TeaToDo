import { ArrowRight } from 'lucide-react';
import type { Task } from '../types/task';
import { getWeekDays, todayKey } from '../utils/date';

interface WeeklyCalendarProps {
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function WeeklyCalendar({ tasks, selectedDate, onSelectDate }: WeeklyCalendarProps) {
  const days = getWeekDays(selectedDate);
  const today = todayKey();
  const compactWeekLabel = (label: string) => label.slice(0, 1);

  return (
    <section className="overflow-hidden rounded-[22px] border border-tea-900/10 bg-white/82 p-4 shadow-card">
      <h3 className="max-w-[11rem] font-display text-2xl font-semibold leading-tight text-tea-950">Calendário semanal</h3>
      <div className="mt-5 flex items-center justify-between text-center">
        {days.map((day) => {
          const count = tasks.filter((task) => task.dueDate === day.dateKey).length;
          const isSelected = day.dateKey === selectedDate;
          const isToday = day.dateKey === today;

          return (
            <button
              type="button"
              key={day.dateKey}
              onClick={() => onSelectDate(day.dateKey)}
              className="grid w-6 grid-rows-[18px_30px_10px] place-items-center rounded-full py-1 transition hover:text-tea-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
              aria-label={`Selecionar ${day.week}, dia ${day.day}`}
            >
              <p className={`grid size-5 place-items-center text-[11px] font-medium ${isToday ? 'text-tea-700' : 'text-stone-500'}`}>{compactWeekLabel(day.week)}</p>
              <div className={`mx-auto grid size-7 place-items-center rounded-full text-sm ${isSelected ? 'bg-tea-600 text-white shadow-card' : 'text-stone-600'}`}>{day.day}</div>
              <span className={`mx-auto block size-1.5 rounded-full ${count ? 'bg-tea-600' : 'bg-stone-300'}`} />
            </button>
          );
        })}
      </div>
      <button
        className="mt-7 flex w-full items-center justify-between border-t border-tea-900/10 pt-4 text-sm text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
        type="button"
        onClick={() => onSelectDate(today)}
      >
        {selectedDate === today ? 'Hoje selecionado' : 'Voltar para hoje'}
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
