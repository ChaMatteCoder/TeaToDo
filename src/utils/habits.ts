import { addDays, eachDayOfInterval, endOfWeek, isAfter, isBefore, parseISO, startOfWeek, subDays } from 'date-fns';
import type { Habit, HabitCategory, HabitFrequency, HabitInput, HabitLog } from '../types/habit';
import { toDateKey, todayKey } from './date';

export const WEEK_DAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
];

export const habitCategoryLabels: Record<HabitCategory, string> = {
  health: 'Saúde',
  mind: 'Mente',
  study: 'Estudos',
  organization: 'Organização',
  custom: 'Personalizado',
};

export const habitPresets: Array<HabitInput & { presetId: string }> = [
  {
    presetId: 'water',
    title: 'Beber água',
    description: 'Acompanhe seus copos ao longo do dia.',
    category: 'health',
    icon: 'droplets',
    frequency: { type: 'daily' },
    target: { type: 'quantity', value: 8, unit: 'copos' },
    active: true,
  },
  {
    presetId: 'exercise',
    title: 'Exercitar-se',
    category: 'health',
    icon: 'dumbbell',
    frequency: { type: 'specificDays', daysOfWeek: [1, 3, 5] },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'sleep',
    title: 'Dormir cedo',
    category: 'health',
    icon: 'moon',
    frequency: { type: 'weekdays' },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'meditate',
    title: 'Meditar',
    category: 'mind',
    icon: 'leaf',
    frequency: { type: 'daily' },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'journal',
    title: 'Escrever diário',
    category: 'mind',
    icon: 'sparkles',
    frequency: { type: 'daily' },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'study',
    title: 'Estudar 50 minutos',
    category: 'study',
    icon: 'book',
    frequency: { type: 'weekdays' },
    target: { type: 'quantity', value: 50, unit: 'min' },
    active: true,
  },
  {
    presetId: 'review',
    title: 'Revisar conteúdo',
    category: 'study',
    icon: 'book-check',
    frequency: { type: 'specificDays', daysOfWeek: [2, 4, 6] },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'plan-day',
    title: 'Planejar o dia',
    category: 'organization',
    icon: 'calendar-check',
    frequency: { type: 'daily' },
    target: { type: 'check', value: 1 },
    active: true,
  },
  {
    presetId: 'desk',
    title: 'Organizar mesa',
    category: 'organization',
    icon: 'list-checks',
    frequency: { type: 'weekdays' },
    target: { type: 'check', value: 1 },
    active: true,
  },
];

export function isHabitExpectedOnDate(habit: Habit, dateKey: string) {
  if (!habit.active) return false;
  const day = parseISO(dateKey).getDay();
  if (habit.frequency.type === 'daily') return true;
  if (habit.frequency.type === 'weekdays') return day >= 1 && day <= 5;
  return Boolean(habit.frequency.daysOfWeek?.includes(day));
}

export function getWeekDateKeys(referenceDateKey: string) {
  const reference = parseISO(referenceDateKey);
  const start = startOfWeek(reference, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, index) => toDateKey(addDays(start, index)));
}

export function formatHabitFrequency(frequency: HabitFrequency) {
  if (frequency.type === 'daily') return 'Todos os dias';
  if (frequency.type === 'weekdays') return 'Dias úteis';
  const days = frequency.daysOfWeek ?? [];
  if (!days.length) return 'Dias específicos';
  return WEEK_DAYS.filter((day) => days.includes(day.value)).map((day) => day.label).join(', ');
}

export function getHabitLog(logs: HabitLog[], habitId: string, dateKey: string) {
  return logs.find((log) => log.habitId === habitId && log.date === dateKey) ?? null;
}

export function getDailyHabitStats(habits: Habit[], logs: HabitLog[], dateKey: string) {
  const expected = habits.filter((habit) => isHabitExpectedOnDate(habit, dateKey));
  const completed = expected.filter((habit) => getHabitLog(logs, habit.id, dateKey)?.completed).length;
  return {
    total: expected.length,
    completed,
    pending: Math.max(expected.length - completed, 0),
    percent: expected.length ? Math.round((completed / expected.length) * 100) : 0,
  };
}

export function getWeeklyHabitStats(habits: Habit[], logs: HabitLog[], referenceDateKey: string) {
  const days = getWeekDateKeys(referenceDateKey);
  const expectedPairs = days.flatMap((dateKey) => habits.filter((habit) => isHabitExpectedOnDate(habit, dateKey)).map((habit) => ({ habit, dateKey })));
  const completed = expectedPairs.filter(({ habit, dateKey }) => getHabitLog(logs, habit.id, dateKey)?.completed).length;
  return {
    days,
    totalExpected: expectedPairs.length,
    completed,
    percent: expectedPairs.length ? Math.round((completed / expectedPairs.length) * 100) : 0,
  };
}

export function getCurrentStreak(habit: Habit, logs: HabitLog[]) {
  let cursor = todayKey();
  let streak = 0;
  for (let index = 0; index < 730; index += 1) {
    if (!isHabitExpectedOnDate(habit, cursor)) {
      cursor = toDateKey(subDays(parseISO(cursor), 1));
      continue;
    }
    if (!getHabitLog(logs, habit.id, cursor)?.completed) break;
    streak += 1;
    cursor = toDateKey(subDays(parseISO(cursor), 1));
  }
  return streak;
}

export function getBestStreak(habit: Habit, logs: HabitLog[]) {
  const relevant = logs
    .filter((log) => log.habitId === habit.id && log.completed)
    .map((log) => log.date)
    .sort();
  if (!relevant.length) return 0;
  let best = 0;
  let current = 0;
  const first = parseISO(relevant[0]);
  const last = parseISO(relevant[relevant.length - 1]);
  for (const day of eachDayOfInterval({ start: first, end: last })) {
    const key = toDateKey(day);
    if (!isHabitExpectedOnDate(habit, key)) continue;
    if (relevant.includes(key)) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

export function getHabitCompletionRate(habit: Habit, logs: HabitLog[], startDateKey: string, endDateKey: string) {
  const start = parseISO(startDateKey);
  const end = parseISO(endDateKey);
  if (isAfter(start, end)) return 0;
  const days = eachDayOfInterval({ start, end }).filter((day) => {
    const key = toDateKey(day);
    return !isBefore(day, parseISO(habit.createdAt)) && isHabitExpectedOnDate(habit, key);
  });
  if (!days.length) return 0;
  const completed = days.filter((day) => getHabitLog(logs, habit.id, toDateKey(day))?.completed).length;
  return Math.round((completed / days.length) * 100);
}

export function getBestOverallStreak(habits: Habit[], logs: HabitLog[]) {
  return habits.reduce((best, habit) => Math.max(best, getBestStreak(habit, logs)), 0);
}

export function getLogValue(log: HabitLog | null) {
  return log?.value ?? 0;
}

export function getHabitProgressPercent(habit: Habit, log: HabitLog | null) {
  if (habit.target.type === 'check') return log?.completed ? 100 : 0;
  return Math.min(100, Math.round((getLogValue(log) / habit.target.value) * 100));
}

export function getDefaultWeekRange(referenceDateKey: string) {
  const start = startOfWeek(parseISO(referenceDateKey), { weekStartsOn: 1 });
  const end = endOfWeek(parseISO(referenceDateKey), { weekStartsOn: 1 });
  return { start: toDateKey(start), end: toDateKey(end) };
}
