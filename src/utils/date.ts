import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '../types/task';

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function formatShortDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year}`;
}

export function getTaskListTitle(dateKey: string) {
  return dateKey === todayKey() ? 'Hoje' : `Tarefas de ${formatShortDate(dateKey).slice(0, 5)}`;
}

export function getWeekDays(selectedDate: string) {
  const base = parseDateKey(selectedDate);
  const day = base.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      dateKey: toDateKey(date),
      week: WEEKDAY_SHORT[date.getDay()],
      day: `${date.getDate()}`.padStart(2, '0'),
    };
  });
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatRelativeDate(dateKey: string) {
  const today = parseDateKey(todayKey());
  const target = parseDateKey(dateKey);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff > 1 && diff < 7) return WEEKDAY_SHORT[target.getDay()];
  return formatShortDate(dateKey).slice(0, 5);
}

export function sortByDateTime<T extends { dueDate: string; dueTime: string }>(items: T[]) {
  return [...items].sort((a, b) => `${a.dueDate} ${a.dueTime || '99:99'}`.localeCompare(`${b.dueDate} ${b.dueTime || '99:99'}`));
}

export function formatCompletedAt(value?: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function parseDate(dateKey: string) {
  return parseISO(dateKey);
}

export function isTodayDate(date: Date) {
  return isToday(date);
}

export function getMonthMatrix(date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function getNextSevenDays(date: Date) {
  return Array.from({ length: 7 }).map((_, index) => addDays(date, index));
}

export function formatMonthYear(date: Date) {
  return format(date, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatAgendaLabel(date: Date) {
  if (isToday(date)) return 'Hoje';
  return format(date, "EEE, d 'de' MMMM", { locale: ptBR }).replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatDeadlineDate(dateKey: string) {
  return format(parseISO(dateKey), "EEE, dd/MM", { locale: ptBR }).replace(/^\w/, (letter) => letter.toUpperCase());
}

export function sortTasksByDateTime(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return `${a.dueDate} ${a.dueTime || '99:99'}`.localeCompare(`${b.dueDate} ${b.dueTime || '99:99'}`);
  });
}

export function isSameDateKey(date: Date, dateKey: string) {
  return isSameDay(date, parseISO(dateKey));
}
