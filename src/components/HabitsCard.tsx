import { Link } from 'react-router-dom';
import { Leaf, Minus, MoreHorizontal, Plus } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { todayKey } from '../utils/date';
import { getHabitProgressPercent, getWeekDateKeys } from '../utils/habits';
import { getHabitIcon } from './habits/habitIcons';

export function HabitsCard() {
  const habitsApi = useHabits();
  const today = todayKey();
  const allTodayHabits = habitsApi.getHabitsForDate(today);
  const todayHabits = allTodayHabits.slice(0, 2);
  const hiddenHabitsCount = Math.max(0, allTodayHabits.length - todayHabits.length);
  const stats = habitsApi.getDailyStats(today);
  const weekDays = getWeekDateKeys(today);

  return (
    <section className="overflow-hidden rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold text-tea-950">Hábitos</h3>
        <Link className="text-sm font-medium text-tea-700" to="/habitos">
          Ver todos
        </Link>
      </div>
      {todayHabits.length ? (
        <div className="space-y-3">
          {todayHabits.map((habit) => {
            const Icon = getHabitIcon(habit.icon);
            const log = habitsApi.getHabitLog(habit.id, today);
            const progress = getHabitProgressPercent(habit, log);
            return (
              <div className="rounded-2xl bg-linen/35 px-3 py-3" key={habit.id}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${log?.completed ? 'bg-tea-600 text-white' : 'bg-tea-100 text-tea-700'}`}>
                    <Icon size={17} />
                  </span>
                  <p className={`min-w-0 truncate text-sm font-semibold ${log?.completed ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{habit.title}</p>
                  {habit.target.type === 'quantity' ? (
                    <p className="w-12 text-right text-xs font-semibold leading-4 text-stone-600">
                      {log?.value ?? 0}
                      <span className="text-stone-300">/{habit.target.value}</span>
                    </p>
                  ) : (
                    <button type="button" onClick={() => habitsApi.toggleHabitForDate(habit.id, today)} aria-label="Alternar hábito" className={`grid size-10 place-items-center rounded-full text-sm font-bold shadow-card transition hover:scale-105 ${log?.completed ? 'bg-tea-700 text-white' : 'border border-tea-900/10 bg-white text-tea-700'}`}>
                      {log?.completed ? '✓' : <span className="size-2 rounded-full bg-current" />}
                    </button>
                  )}
                </div>
                {habit.target.type === 'quantity' ? (
                  <div className="mt-3 flex min-w-0 items-center gap-2 pl-12">
                    <button type="button" onClick={() => habitsApi.decrementHabit(habit.id, today)} aria-label="Diminuir hábito" className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-tea-700">
                      <Minus size={13} />
                    </button>
                    <div className="h-2 min-w-0 flex-1 rounded-full bg-oat">
                      <div className="h-full rounded-full bg-tea-600" style={{ width: `${progress}%` }} />
                    </div>
                    <button type="button" onClick={() => habitsApi.incrementHabit(habit.id, today)} aria-label="Aumentar hábito" className="grid size-6 shrink-0 place-items-center rounded-full bg-tea-700 text-white">
                      <Plus size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    {weekDays.map((dateKey) => {
                      const dayLog = habitsApi.getHabitLog(habit.id, dateKey);
                      return (
                        <span key={dateKey} className={`grid size-3.5 place-items-center rounded-full ${dayLog?.completed ? 'bg-tea-600' : 'border border-stone-300 bg-white/60'}`}>
                          {dayLog?.completed ? <span className="size-1.5 rounded-full bg-white" /> : null}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {hiddenHabitsCount ? (
            <Link to="/habitos" aria-label="Ver todos os hábitos" className="grid min-h-10 place-items-center rounded-2xl bg-linen/70 text-tea-700 transition hover:bg-tea-50">
              <MoreHorizontal size={22} />
            </Link>
          ) : null}
          <p className="rounded-2xl bg-linen/70 px-3 py-2 text-center text-xs font-bold text-tea-700">
            {stats.completed}/{stats.total} concluídos hoje
          </p>
        </div>
      ) : (
        <div className="grid min-h-[172px] place-items-center rounded-3xl bg-linen/60 p-5 text-center">
          <div>
            <Leaf className="mx-auto mb-2 text-tea-600" size={22} />
            <p className="font-display text-lg font-semibold leading-6 text-tea-900">Nenhum hábito para hoje.</p>
            <Link to="/habitos" className="mt-3 inline-flex h-9 items-center rounded-full bg-tea-700 px-4 text-xs font-semibold text-white">
              Criar ritual
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
