import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Save, Trash2, X } from 'lucide-react';
import type { RecurringRoutine } from '../../types/routine';

interface RoutineModalProps {
  isOpen: boolean;
  routines: RecurringRoutine[];
  onClose: () => void;
  onSave: (routine: Partial<RecurringRoutine> & { title: string }) => void;
  onRemove: (id: string) => void;
}

const days = [
  { label: 'D', value: 0 },
  { label: 'S', value: 1 },
  { label: 'T', value: 2 },
  { label: 'Q', value: 3 },
  { label: 'Q', value: 4 },
  { label: 'S', value: 5 },
  { label: 'S', value: 6 },
];

const emptyRoutine = {
  title: '',
  description: '',
  time: '',
  daysOfWeek: [] as number[],
  category: 'Rotina',
  active: true,
};

export function RoutineModal({ isOpen, routines, onClose, onSave, onRemove }: RoutineModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyRoutine);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const selected = routines.find((routine) => routine.id === selectedId);
    setDraft(
      selected
        ? {
            title: selected.title,
            description: selected.description ?? '',
            time: selected.time ?? '',
            daysOfWeek: selected.daysOfWeek,
            category: selected.category ?? 'Rotina',
            active: selected.active,
          }
        : emptyRoutine,
    );
    setError('');
  }, [isOpen, routines, selectedId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const toggleDay = (day: number) => {
    setDraft((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(day) ? current.daysOfWeek.filter((value) => value !== day) : [...current.daysOfWeek, day].sort(),
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError('Dê um nome para a rotina.');
      return;
    }
    onSave({ id: selectedId ?? undefined, ...draft, title: draft.title.trim() });
    setSelectedId(null);
    setDraft(emptyRoutine);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-tea-950/24 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.form
            onSubmit={handleSubmit}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-tea-900/10 bg-linen p-6 shadow-[0_24px_90px_rgba(47,61,36,0.24)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="routine-modal-title"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="routine-modal-title" className="font-display text-3xl font-semibold text-tea-950">
                Rotinas recorrentes
              </h2>
              <button type="button" onClick={onClose} aria-label="Fechar modal de rotinas" className="grid size-10 place-items-center rounded-full border border-tea-900/10 bg-white/70 text-stone-500">
                <X size={18} />
              </button>
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setSelectedId(null)} className={`rounded-full px-3 py-2 text-sm font-semibold ${selectedId === null ? 'bg-tea-700 text-white' : 'bg-white text-stone-600'}`}>
                Nova rotina
              </button>
              {routines.map((routine) => (
                <button type="button" key={routine.id} onClick={() => setSelectedId(routine.id)} className={`rounded-full px-3 py-2 text-sm font-semibold ${selectedId === routine.id ? 'bg-tea-700 text-white' : 'bg-white text-stone-600'}`}>
                  {routine.title}
                </button>
              ))}
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Nome</span>
                <input className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Descrição</span>
                <textarea className="min-h-20 rounded-2xl border border-tea-900/10 bg-white/78 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-700">Horário</span>
                  <input type="time" className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-700">Categoria</span>
                  <input className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
                </label>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-stone-700">Dias da semana</p>
                <div className="flex gap-2">
                  {days.map((day) => (
                    <button type="button" key={`${day.label}-${day.value}`} onClick={() => toggleDay(day.value)} className={`grid size-9 place-items-center rounded-full text-sm font-bold ${draft.daysOfWeek.includes(day.value) ? 'bg-tea-700 text-white' : 'bg-white text-stone-500'}`}>
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-stone-700">
                <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
                Rotina ativa
              </label>
            </div>
            {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}
            <div className="mt-6 flex justify-between gap-3">
              {selectedId ? (
                <button type="button" onClick={() => onRemove(selectedId)} className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                  <Trash2 size={16} />
                  Excluir
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="flex items-center gap-2 rounded-full bg-tea-700 px-5 py-3 text-sm font-semibold text-white">
                <Save size={16} />
                Salvar rotina
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
