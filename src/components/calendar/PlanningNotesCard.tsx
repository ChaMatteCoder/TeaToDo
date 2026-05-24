import { Leaf } from 'lucide-react';
import type { PlanningNote } from '../../types/planningNote';

interface PlanningNotesCardProps {
  notes: PlanningNote[];
  onEdit: () => void;
}

export function PlanningNotesCard({ notes, onEdit }: PlanningNotesCardProps) {
  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Notas de planejamento</h2>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-tea-700">
          Editar
        </button>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-tea-50 to-oat/55 p-5">
        {notes.length ? (
          <ul className="space-y-3">
            {notes.slice(0, 3).map((note) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={note.id}>
                <span className="mt-2 size-1.5 rounded-full bg-tea-600" />
                {note.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center font-display text-lg text-tea-900">Adicione lembretes para orientar sua semana.</p>
        )}
        <div className="mt-5 flex items-center gap-3 border-t border-tea-900/10 pt-4 text-sm text-stone-600">
          <Leaf className="text-tea-500" size={22} />
          Menos pressa, mais presença.
        </div>
      </div>
    </section>
  );
}
