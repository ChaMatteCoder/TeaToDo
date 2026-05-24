import { Edit3, Minus, Plus, Power, Trash2 } from 'lucide-react';
import type { Habit, HabitLog } from '../../types/habit';
import { formatHabitFrequency, getHabitProgressPercent, habitCategoryLabels } from '../../utils/habits';
import { getHabitIcon } from './habitIcons';

interface HabitCardProps {
  habit: Habit;
  log: HabitLog | null;
  streak: number;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetValue: (value: number) => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, log, streak, onToggle, onIncrement, onDecrement, onSetValue, onEdit, onToggleActive, onDelete }: HabitCardProps) {
  const Icon = getHabitIcon(habit.icon);
  const value = log?.value ?? 0;
  const progress = getHabitProgressPercent(habit, log);
  const completed = Boolean(log?.completed);

  return (
    <article className={`relative min-w-0 overflow-hidden rounded-[28px] border p-5 shadow-card transition ${completed ? 'border-tea-500/20 bg-tea-50/80' : 'border-tea-900/10 bg-white/74'}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-tea-100/50 blur-2xl" />
      <div className="relative flex items-start gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${completed ? 'bg-tea-600 text-white' : 'bg-tea-100 text-tea-700'}`}>
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`truncate font-display text-2xl font-semibold ${completed ? 'text-tea-800' : 'text-tea-900'}`}>{habit.title}</h3>
              <p className="mt-1 truncate text-sm text-stone-500">
                {habitCategoryLabels[habit.category]} · {formatHabitFrequency(habit.frequency)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={onEdit} aria-label="Editar hábito" className="grid size-9 place-items-center rounded-full text-stone-400 hover:bg-white hover:text-tea-700">
                <Edit3 size={16} />
              </button>
              <button type="button" onClick={onToggleActive} aria-label={habit.active ? 'Pausar hábito' : 'Ativar hábito'} className="grid size-9 place-items-center rounded-full text-stone-400 hover:bg-white hover:text-tea-700">
                <Power size={16} />
              </button>
              <button type="button" onClick={onDelete} aria-label="Excluir hábito" className="grid size-9 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {habit.description ? <p className="mt-3 line-clamp-2 text-sm leading-5 text-stone-500">{habit.description}</p> : null}

          {habit.target.type === 'check' ? (
            <button
              type="button"
              onClick={onToggle}
              className={`mt-4 h-11 rounded-full px-5 text-sm font-semibold transition ${completed ? 'bg-tea-700 text-white' : 'bg-linen text-tea-800 hover:bg-tea-100'}`}
            >
              {completed ? 'Feito hoje' : 'Marcar como feito'}
            </button>
          ) : (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-stone-600">
                <span>
                  {value}/{habit.target.value} {habit.target.unit}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-oat">
                <div className="h-full rounded-full bg-tea-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={onDecrement} aria-label="Diminuir progresso" className="grid size-10 place-items-center rounded-full bg-linen text-tea-700">
                  <Minus size={17} />
                </button>
                <input
                  value={value}
                  onChange={(event) => onSetValue(Number(event.target.value))}
                  className="h-10 w-24 rounded-full border border-tea-900/10 bg-white/80 px-3 text-center font-semibold outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10"
                  inputMode="numeric"
                  aria-label="Valor do hábito no dia"
                />
                <button type="button" onClick={onIncrement} aria-label="Aumentar progresso" className="grid size-10 place-items-center rounded-full bg-tea-700 text-white">
                  <Plus size={17} />
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-tea-600">Sequência atual: {streak} dias</p>
        </div>
      </div>
    </article>
  );
}
