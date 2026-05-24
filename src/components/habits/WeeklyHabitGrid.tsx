import type { Habit, HabitLog } from '../../types/habit';
import { getHabitLog, isHabitExpectedOnDate, WEEK_DAYS } from '../../utils/habits';
import { getHabitIcon } from './habitIcons';

interface WeeklyHabitGridProps {
  habits: Habit[];
  logs: HabitLog[];
  weekDays: string[];
  onToggleCell: (habit: Habit, dateKey: string) => void;
}

export function WeeklyHabitGrid({ habits, logs, weekDays, onToggleCell }: WeeklyHabitGridProps) {
  const activeHabits = habits.filter((habit) => habit.active);

  return (
    <section className="overflow-hidden rounded-[30px] border border-tea-900/10 bg-white/72 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-tea-900">Progresso semanal</h2>
          <p className="mt-1 text-sm text-stone-500">Clique em uma célula esperada para alternar o registro.</p>
        </div>
      </div>
      <div className="teatodo-scrollbar overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[220px_repeat(7,1fr)] gap-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-stone-400">
            <span className="text-left">Hábito</span>
            {weekDays.map((dateKey) => {
              const date = new Date(`${dateKey}T00:00:00`);
              return <span key={dateKey}>{WEEK_DAYS.find((day) => day.value === date.getDay())?.label}</span>;
            })}
          </div>
          <div className="mt-3 grid gap-2">
            {activeHabits.length ? activeHabits.map((habit) => {
              const Icon = getHabitIcon(habit.icon);
              return (
                <div key={habit.id} className="grid grid-cols-[220px_repeat(7,1fr)] items-center gap-2 rounded-2xl bg-linen/70 p-2">
                  <div className="flex min-w-0 items-center gap-2 px-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tea-100 text-tea-700">
                      <Icon size={15} />
                    </span>
                    <p className="truncate text-sm font-semibold text-tea-900">{habit.title}</p>
                  </div>
                  {weekDays.map((dateKey) => {
                    const expected = isHabitExpectedOnDate(habit, dateKey);
                    const log = getHabitLog(logs, habit.id, dateKey);
                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={!expected}
                        onClick={() => onToggleCell(habit, dateKey)}
                        aria-label={`Alternar ${habit.title} em ${dateKey}`}
                        className={`mx-auto grid size-8 place-items-center rounded-full text-sm font-bold transition ${
                          !expected ? 'text-stone-300' : log?.completed ? 'bg-tea-600 text-white' : 'border border-stone-300 bg-white text-stone-400 hover:border-tea-500'
                        }`}
                      >
                        {!expected ? '–' : log?.completed ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              );
            }) : (
              <div className="grid min-h-36 place-items-center rounded-3xl bg-linen/70 text-center font-display text-xl font-semibold text-tea-900">
                Nenhum hábito ativo para exibir na semana.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
