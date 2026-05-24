import { useEffect, useState } from 'react';
import type { RecurringRoutine } from '../types/routine';
import type { TaskInput } from '../types/task';
import { formatDateKey } from '../utils/date';

const STORAGE_KEY = 'teatodo:routines';
const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const demoRoutines = (): RecurringRoutine[] => [];

const normalizeRoutine = (value: unknown): RecurringRoutine | null => {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<RecurringRoutine>;
  if (typeof item.title !== 'string' || !item.title.trim()) return null;
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : nowIso();

  return {
    id: typeof item.id === 'string' ? item.id : makeId(),
    title: item.title.trim(),
    description: typeof item.description === 'string' ? item.description : '',
    time: typeof item.time === 'string' ? item.time : '',
    daysOfWeek: Array.isArray(item.daysOfWeek) ? item.daysOfWeek.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6) : [],
    category: typeof item.category === 'string' ? item.category : 'Rotina',
    active: item.active !== false,
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
  };
};

const readRoutines = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoRoutines();
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRoutine).filter((routine): routine is RecurringRoutine => Boolean(routine));
  } catch {
    return [];
  }
};

export function generateTasksFromRoutines(routines: RecurringRoutine[], date: Date): TaskInput[] {
  const day = date.getDay();
  return routines
    .filter((routine) => routine.active && routine.daysOfWeek.includes(day))
    .map((routine) => ({
      title: routine.title,
      description: routine.description ?? '',
      priority: 'low',
      category: routine.category || 'Rotina',
      dueDate: formatDateKey(date),
      dueTime: routine.time ?? '',
      subtasks: [],
    }));
}

export function useRoutines() {
  const [routines, setRoutines] = useState<RecurringRoutine[]>(readRoutines);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  const saveRoutine = (input: Partial<RecurringRoutine> & { title: string }) => {
    const title = input.title.trim();
    if (!title) return null;
    const timestamp = nowIso();

    if (input.id) {
      setRoutines((current) =>
        current.map((routine) =>
          routine.id === input.id
            ? {
                ...routine,
                ...input,
                title,
                daysOfWeek: input.daysOfWeek ?? routine.daysOfWeek,
                updatedAt: timestamp,
              }
            : routine,
        ),
      );
      return input.id;
    }

    const next: RecurringRoutine = {
      id: makeId(),
      title,
      description: input.description ?? '',
      time: input.time ?? '',
      daysOfWeek: input.daysOfWeek ?? [],
      category: input.category ?? 'Rotina',
      active: input.active ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setRoutines((current) => [next, ...current]);
    return next.id;
  };

  const removeRoutine = (id: string) => {
    setRoutines((current) => current.filter((routine) => routine.id !== id));
  };

  return { routines, saveRoutine, removeRoutine };
}
