import { useEffect, useMemo, useState } from 'react';
import type { Habit, HabitInput, HabitLog } from '../types/habit';
import {
  getBestOverallStreak,
  getBestStreak,
  getCurrentStreak,
  getDailyHabitStats,
  getHabitCompletionRate,
  getHabitLog,
  getWeeklyHabitStats,
  isHabitExpectedOnDate,
} from '../utils/habits';

const HABITS_KEY = 'teatodo:habits';
const LOGS_KEY = 'teatodo:habit-logs';
const ENABLE_DEMO_HABITS = false;
const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const demoHabits = (): Habit[] => (ENABLE_DEMO_HABITS ? [] : []);

function safeParse<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function normalizeHabit(value: unknown): Habit | null {
  if (!value || typeof value !== 'object') return null;
  const habit = value as Partial<Habit>;
  if (typeof habit.title !== 'string' || !habit.title.trim()) return null;
  const createdAt = typeof habit.createdAt === 'string' ? habit.createdAt : nowIso();
  const targetType = habit.target?.type === 'quantity' ? 'quantity' : 'check';
  const targetValue = Number(habit.target?.value ?? 1);
  const frequency =
    habit.frequency?.type === 'weekdays'
      ? { type: 'weekdays' as const }
      : habit.frequency?.type === 'specificDays'
        ? {
            type: 'specificDays' as const,
            daysOfWeek: Array.isArray(habit.frequency.daysOfWeek)
              ? habit.frequency.daysOfWeek.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
              : [],
          }
        : { type: 'daily' as const };
  return {
    id: typeof habit.id === 'string' ? habit.id : makeId(),
    title: habit.title.trim(),
    description: typeof habit.description === 'string' ? habit.description : '',
    category: habit.category ?? 'custom',
    icon: typeof habit.icon === 'string' ? habit.icon : undefined,
    frequency,
    target: {
      type: targetType,
      value: Number.isFinite(targetValue) && targetValue > 0 ? targetValue : 1,
      unit: typeof habit.target?.unit === 'string' ? habit.target.unit : '',
    },
    reminderTime: typeof habit.reminderTime === 'string' ? habit.reminderTime : '',
    active: habit.active !== false,
    createdAt,
    updatedAt: typeof habit.updatedAt === 'string' ? habit.updatedAt : createdAt,
  };
}

function normalizeLog(value: unknown): HabitLog | null {
  if (!value || typeof value !== 'object') return null;
  const log = value as Partial<HabitLog>;
  if (typeof log.habitId !== 'string' || typeof log.date !== 'string') return null;
  const createdAt = typeof log.createdAt === 'string' ? log.createdAt : nowIso();
  return {
    id: typeof log.id === 'string' ? log.id : makeId(),
    habitId: log.habitId,
    date: log.date,
    value: Number(log.value ?? 0),
    completed: Boolean(log.completed),
    note: typeof log.note === 'string' ? log.note : '',
    createdAt,
    updatedAt: typeof log.updatedAt === 'string' ? log.updatedAt : createdAt,
  };
}

const readHabits = () => {
  const parsed = safeParse<unknown[]>(HABITS_KEY, demoHabits());
  return Array.isArray(parsed) ? parsed.map(normalizeHabit).filter((habit): habit is Habit => Boolean(habit)) : [];
};

const readLogs = () => {
  const parsed = safeParse<unknown[]>(LOGS_KEY, []);
  return Array.isArray(parsed) ? parsed.map(normalizeLog).filter((log): log is HabitLog => Boolean(log)) : [];
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(readHabits);
  const [logs, setLogs] = useState<HabitLog[]>(readLogs);

  useEffect(() => {
    window.localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  const createHabit = (input: HabitInput) => {
    const title = input.title.trim();
    if (!title) return null;
    const timestamp = nowIso();
    const habit: Habit = {
      ...input,
      id: makeId(),
      title,
      description: input.description?.trim() ?? '',
      active: input.active,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setHabits((current) => [habit, ...current]);
    return habit;
  };

  const updateHabit = (id: string, changes: Partial<HabitInput>) => {
    setHabits((current) => current.map((habit) => (habit.id === id ? { ...habit, ...changes, title: changes.title?.trim() ?? habit.title, updatedAt: nowIso() } : habit)));
  };

  const deleteHabit = (id: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
    // MVP decision: remove associated logs when deleting to avoid orphan local data.
    setLogs((current) => current.filter((log) => log.habitId !== id));
  };

  const toggleHabitActive = (id: string) => {
    setHabits((current) => current.map((habit) => (habit.id === id ? { ...habit, active: !habit.active, updatedAt: nowIso() } : habit)));
  };

  const upsertLog = (habitId: string, date: string, value: number, completed: boolean, note?: string) => {
    const timestamp = nowIso();
    setLogs((current) => {
      const existing = current.find((log) => log.habitId === habitId && log.date === date);
      if (existing) {
        return current.map((log) => (log.id === existing.id ? { ...log, value, completed, note: note ?? log.note, updatedAt: timestamp } : log));
      }
      return [{ id: makeId(), habitId, date, value, completed, note: note ?? '', createdAt: timestamp, updatedAt: timestamp }, ...current];
    });
  };

  const setHabitValue = (habitId: string, date: string, value: number) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit) return;
    const nextValue = Math.max(0, value);
    upsertLog(habitId, date, nextValue, nextValue >= habit.target.value);
  };

  const toggleHabitForDate = (habitId: string, date: string) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit) return;
    const existing = getHabitLog(logs, habitId, date);
    if (habit.target.type === 'quantity') {
      const completed = !existing?.completed;
      upsertLog(habitId, date, completed ? habit.target.value : 0, completed);
      return;
    }
    const completed = !existing?.completed;
    upsertLog(habitId, date, completed ? 1 : 0, completed);
  };

  const incrementHabit = (habitId: string, date: string, amount = 1) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit) return;
    const current = getHabitLog(logs, habitId, date)?.value ?? 0;
    setHabitValue(habitId, date, current + amount);
  };

  const decrementHabit = (habitId: string, date: string, amount = 1) => {
    const current = getHabitLog(logs, habitId, date)?.value ?? 0;
    setHabitValue(habitId, date, current - amount);
  };

  const getHabitsForDate = (date: string) => habits.filter((habit) => isHabitExpectedOnDate(habit, date));
  const getDailyStats = (date: string) => getDailyHabitStats(habits, logs, date);
  const getWeeklyStats = (date: string) => getWeeklyHabitStats(habits, logs, date);

  const stats = useMemo(
    () => ({
      getHabitLog: (habitId: string, date: string) => getHabitLog(logs, habitId, date),
      getCurrentStreak: (habitId: string) => {
        const habit = habits.find((item) => item.id === habitId);
        return habit ? getCurrentStreak(habit, logs) : 0;
      },
      getBestStreak: (habitId: string) => {
        const habit = habits.find((item) => item.id === habitId);
        return habit ? getBestStreak(habit, logs) : 0;
      },
      getBestOverallStreak: () => getBestOverallStreak(habits, logs),
      getHabitCompletionRate: (habitId: string, startDate: string, endDate: string) => {
        const habit = habits.find((item) => item.id === habitId);
        return habit ? getHabitCompletionRate(habit, logs, startDate, endDate) : 0;
      },
    }),
    [habits, logs],
  );

  return {
    habits,
    logs,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitActive,
    toggleHabitForDate,
    incrementHabit,
    decrementHabit,
    setHabitValue,
    getHabitsForDate,
    getDailyStats,
    getWeeklyStats,
    ...stats,
  };
}
