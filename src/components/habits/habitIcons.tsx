import { BookOpen, CalendarCheck, Droplets, Dumbbell, Leaf, ListChecks, Moon, Sparkles } from 'lucide-react';

export const habitIconOptions = [
  { value: 'droplets', label: 'Água', icon: Droplets },
  { value: 'leaf', label: 'Folha', icon: Leaf },
  { value: 'dumbbell', label: 'Exercício', icon: Dumbbell },
  { value: 'book', label: 'Estudo', icon: BookOpen },
  { value: 'calendar-check', label: 'Plano', icon: CalendarCheck },
  { value: 'list-checks', label: 'Organização', icon: ListChecks },
  { value: 'sparkles', label: 'Mente', icon: Sparkles },
  { value: 'moon', label: 'Sono', icon: Moon },
  { value: 'book-check', label: 'Revisão', icon: BookOpen },
] as const;

export function getHabitIcon(icon?: string) {
  return habitIconOptions.find((item) => item.value === icon)?.icon ?? Leaf;
}
