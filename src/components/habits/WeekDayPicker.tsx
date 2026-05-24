import { getWeekDateKeys, WEEK_DAYS } from '../../utils/habits';
import { todayKey } from '../../utils/date';

interface WeekDayPickerProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export function WeekDayPicker({ selectedDate, onSelectDate }: WeekDayPickerProps) {
  const days = getWeekDateKeys(selectedDate);
  const today = todayKey();

  return (
    <div className="teatodo-scrollbar flex gap-2 overflow-x-auto rounded-[24px] border border-tea-900/10 bg-white/72 p-3 shadow-card">
      {days.map((dateKey) => {
        const date = new Date(`${dateKey}T00:00:00`);
        const active = dateKey === selectedDate;
        return (
          <button
            key={dateKey}
            type="button"
            onClick={() => onSelectDate(dateKey)}
            className={`grid min-w-20 place-items-center rounded-2xl px-3 py-3 text-sm font-semibold transition ${
              active ? 'bg-tea-700 text-white shadow-card' : dateKey === today ? 'bg-tea-100 text-tea-800' : 'bg-linen/70 text-stone-500 hover:bg-tea-50'
            }`}
          >
            <span className="text-xs uppercase">{WEEK_DAYS.find((day) => day.value === date.getDay())?.label}</span>
            <span className="mt-1 font-display text-2xl">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
