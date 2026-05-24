import { CalendarCheck, Leaf } from 'lucide-react';
import type { RecurringRoutine } from '../../types/routine';

interface RecurringRoutinesCardProps {
  routines: RecurringRoutine[];
  onEdit: () => void;
}

const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function recurrenceLabel(daysOfWeek: number[]) {
  if (daysOfWeek.length === 7) return 'Todos os dias';
  if (!daysOfWeek.length) return 'Sem dias definidos';
  return daysOfWeek.map((day) => dayLabels[day]).join(', ');
}

export function RecurringRoutinesCard({ routines, onEdit }: RecurringRoutinesCardProps) {
  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Rotinas recorrentes</h2>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-tea-700">
          Editar
        </button>
      </div>
      <div className="space-y-3">
        {routines.slice(0, 3).map((routine) => (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl px-1 py-1 sm:grid-cols-[auto_minmax(0,1fr)]" key={routine.id}>
            <span className="grid size-10 place-items-center rounded-full bg-tea-100 text-tea-700">
              <CalendarCheck size={18} />
            </span>
            <div className="min-w-0">
              <p className={`truncate font-semibold ${routine.active ? 'text-stone-800' : 'text-stone-400'}`}>{routine.title}</p>
              <p className="text-xs text-stone-500">
                {recurrenceLabel(routine.daysOfWeek)} • {routine.time || 'sem horário'}
              </p>
              <div className="mt-2 grid max-w-[210px] grid-cols-7 gap-1">
                {dayLabels.map((label, index) => (
                  <span
                    key={`${routine.id}-${index}`}
                    className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                      routine.daysOfWeek.includes(index) ? 'bg-tea-600 text-white' : 'border border-stone-200 text-stone-400'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {!routines.length ? (
          <div className="rounded-3xl bg-tea-50/60 px-5 py-8 text-center">
            <Leaf className="mx-auto mb-2 text-tea-500" size={24} />
            <p className="font-display text-lg text-tea-900">Crie rotinas para sustentar sua semana.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
