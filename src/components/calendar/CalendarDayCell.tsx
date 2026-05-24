import { isSameMonth } from 'date-fns';
import type { Task } from '../../types/task';
import { formatDateKey, isTodayDate } from '../../utils/date';

interface CalendarDayCellProps {
  day: Date;
  monthDate: Date;
  selectedDate: string;
  tasks: Task[];
  onSelectDate: (dateKey: string) => void;
}

export function CalendarDayCell({ day, monthDate, selectedDate, tasks, onSelectDate }: CalendarDayCellProps) {
  const dateKey = formatDateKey(day);
  const dayTasks = tasks.filter((task) => task.dueDate === dateKey);
  const hasPending = dayTasks.some((task) => !task.completed);
  const hasCompleted = dayTasks.some((task) => task.completed);
  const hasPriority = dayTasks.some((task) => !task.completed && (task.priority === 'high' || task.priority === 'medium'));
  const isSelected = selectedDate === dateKey;
  const muted = !isSameMonth(day, monthDate);

  return (
    <button
      type="button"
      aria-label={`Selecionar dia ${day.getDate()}`}
      onClick={() => onSelectDate(dateKey)}
      className={`group relative grid min-h-[82px] place-items-center rounded-none border-r border-t border-tea-900/10 p-3 text-center transition hover:bg-tea-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tea-500/35 ${
        isSelected ? 'bg-tea-100/70' : ''
      } ${muted ? 'text-stone-300' : 'text-stone-700'}`}
    >
      <span
        className={`grid size-9 place-items-center rounded-full text-base transition ${
          isSelected ? 'bg-tea-600 text-white shadow-card' : isTodayDate(day) ? 'bg-oat text-tea-800' : ''
        }`}
      >
        {day.getDate()}
      </span>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {hasPending ? <span className="size-1.5 rounded-full bg-tea-600" /> : null}
        {hasCompleted ? <span className="size-1.5 rounded-full bg-stone-300" /> : null}
        {hasPriority ? <span className="size-1.5 rounded-full bg-amber-400" /> : null}
      </div>
    </button>
  );
}
