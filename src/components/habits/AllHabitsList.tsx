import { Edit3, Power, Trash2 } from 'lucide-react';
import type { Habit } from '../../types/habit';
import { formatHabitFrequency, habitCategoryLabels } from '../../utils/habits';
import { getHabitIcon } from './habitIcons';

interface AllHabitsListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onToggleActive: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function AllHabitsList({ habits, onEdit, onToggleActive, onDelete }: AllHabitsListProps) {
  return (
    <section className="rounded-[30px] border border-tea-900/10 bg-white/72 p-5 shadow-card">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-tea-900">Todos os hábitos</h2>
        <p className="mt-1 text-sm text-stone-500">Ative, pause ou edite seus rituais locais.</p>
      </div>
      {habits.length ? (
        <div className="grid gap-3">
          {habits.map((habit) => {
            const Icon = getHabitIcon(habit.icon);
            return (
              <div key={habit.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-tea-900/10 bg-linen/70 p-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full ${habit.active ? 'bg-tea-100 text-tea-700' : 'bg-stone-100 text-stone-400'}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-tea-900">{habit.title}</h3>
                  <p className="truncate text-xs text-stone-500">
                    {habitCategoryLabels[habit.category]} · {formatHabitFrequency(habit.frequency)} · {habit.target.type === 'quantity' ? `${habit.target.value} ${habit.target.unit ?? ''}` : 'check'}
                  </p>
                </div>
                <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex ${habit.active ? 'bg-tea-100 text-tea-700' : 'bg-stone-100 text-stone-500'}`}>
                  {habit.active ? 'Ativo' : 'Pausado'}
                </span>
                <button type="button" onClick={() => onEdit(habit)} aria-label="Editar hábito" className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-white hover:text-tea-700">
                  <Edit3 size={16} />
                </button>
                <button type="button" onClick={() => onToggleActive(habit.id)} aria-label={habit.active ? 'Pausar hábito' : 'Ativar hábito'} className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-white hover:text-tea-700">
                  <Power size={16} />
                </button>
                <button type="button" onClick={() => onDelete(habit.id)} aria-label="Excluir hábito" className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid min-h-40 place-items-center rounded-3xl bg-linen/70 p-8 text-center font-display text-xl font-semibold text-tea-900">
          Nenhum hábito ainda. Comece cultivando uma pequena rotina.
        </div>
      )}
    </section>
  );
}
