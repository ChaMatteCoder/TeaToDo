import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Habit, HabitCategory, HabitFrequencyType, HabitInput, HabitType } from '../../types/habit';
import { WEEK_DAYS, habitCategoryLabels } from '../../utils/habits';
import { habitIconOptions } from './habitIcons';

interface HabitModalProps {
  isOpen: boolean;
  habit?: Habit | null;
  onClose: () => void;
  onSave: (input: HabitInput) => void;
}

const categoryOptions = Object.entries(habitCategoryLabels) as Array<[HabitCategory, string]>;

const emptyInput = (): HabitInput => ({
  title: '',
  description: '',
  category: 'custom',
  icon: 'leaf',
  frequency: { type: 'daily' },
  target: { type: 'check', value: 1, unit: '' },
  reminderTime: '',
  active: true,
});

export function HabitModal({ isOpen, habit, onClose, onSave }: HabitModalProps) {
  const [draft, setDraft] = useState<HabitInput>(emptyInput);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setDraft(
      habit
        ? {
            title: habit.title,
            description: habit.description ?? '',
            category: habit.category,
            icon: habit.icon ?? 'leaf',
            frequency: habit.frequency,
            target: habit.target,
            reminderTime: habit.reminderTime ?? '',
            active: habit.active,
          }
        : emptyInput(),
    );
    setError('');
  }, [habit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const setFrequencyType = (type: HabitFrequencyType) => {
    setDraft((current) => ({
      ...current,
      frequency: type === 'specificDays' ? { type, daysOfWeek: current.frequency.daysOfWeek?.length ? current.frequency.daysOfWeek : [1, 3, 5] } : { type },
    }));
  };

  const toggleDay = (day: number) => {
    setDraft((current) => {
      const selected = current.frequency.daysOfWeek ?? [];
      const next = selected.includes(day) ? selected.filter((item) => item !== day) : [...selected, day].sort();
      return { ...current, frequency: { type: 'specificDays', daysOfWeek: next } };
    });
  };

  const setType = (type: HabitType) => {
    setDraft((current) => ({ ...current, target: { ...current.target, type, value: type === 'check' ? 1 : Math.max(current.target.value, 1) } }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) {
      setError('Informe um nome para o hábito.');
      return;
    }
    if (draft.target.type === 'quantity' && (!Number.isFinite(draft.target.value) || draft.target.value <= 0)) {
      setError('A meta numérica precisa ser maior que zero.');
      return;
    }
    if (draft.frequency.type === 'specificDays' && !draft.frequency.daysOfWeek?.length) {
      setError('Selecione pelo menos um dia da semana.');
      return;
    }
    onSave({ ...draft, title, description: draft.description?.trim(), target: { ...draft.target, unit: draft.target.unit?.trim() } });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-tea-900/24 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.form
            onSubmit={submit}
            className="teatodo-scrollbar max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-tea-900/10 bg-linen p-6 shadow-soft"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-tea-900">{habit ? 'Editar hábito' : 'Novo hábito'}</h2>
                <p className="mt-1 text-sm text-stone-500">Defina uma rotina leve, repetível e mensurável.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Fechar modal" className="grid size-10 place-items-center rounded-full border border-tea-900/10 bg-white/75 text-stone-500">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Nome
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" placeholder="Ex.: Meditar" autoFocus />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Categoria
                <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as HabitCategory })} className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10">
                  {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-tea-900 md:col-span-2">
                Descrição opcional
                <textarea value={draft.description ?? ''} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="min-h-20 resize-none rounded-2xl border border-tea-900/10 bg-white/78 px-4 py-3 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" placeholder="Um lembrete curto sobre este ritual." />
              </label>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-tea-900">Tipo</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    ['check', 'Check simples'],
                    ['quantity', 'Meta numérica'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setType(value as HabitType)} className={`h-11 rounded-full text-sm font-semibold ${draft.target.type === value ? 'bg-tea-700 text-white' : 'bg-white/78 text-stone-500'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {draft.target.type === 'quantity' ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="grid gap-2 text-sm font-semibold text-tea-900">
                      Meta
                      <input type="number" min={1} value={draft.target.value} onChange={(event) => setDraft({ ...draft, target: { ...draft.target, value: Number(event.target.value) } })} className="h-11 rounded-2xl border border-tea-900/10 bg-white/78 px-3 outline-none" />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-tea-900">
                      Unidade
                      <input value={draft.target.unit ?? ''} onChange={(event) => setDraft({ ...draft, target: { ...draft.target, unit: event.target.value } })} className="h-11 rounded-2xl border border-tea-900/10 bg-white/78 px-3 outline-none" placeholder="copos, min" />
                    </label>
                  </div>
                ) : null}
              </div>

              <div>
                <p className="text-sm font-semibold text-tea-900">Frequência</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    ['daily', 'Todos'],
                    ['weekdays', 'Úteis'],
                    ['specificDays', 'Escolher'],
                  ].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setFrequencyType(value as HabitFrequencyType)} className={`h-11 rounded-full text-sm font-semibold ${draft.frequency.type === value ? 'bg-tea-700 text-white' : 'bg-white/78 text-stone-500'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {draft.frequency.type === 'specificDays' ? (
                  <div className="mt-3 grid grid-cols-7 gap-1">
                    {WEEK_DAYS.map((day) => {
                      const active = draft.frequency.daysOfWeek?.includes(day.value);
                      return (
                        <button key={day.value} type="button" onClick={() => toggleDay(day.value)} aria-pressed={active} className={`h-9 rounded-full text-xs font-bold ${active ? 'bg-tea-600 text-white' : 'bg-white text-stone-500'}`}>
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Lembrete opcional
                <input type="time" value={draft.reminderTime ?? ''} onChange={(event) => setDraft({ ...draft, reminderTime: event.target.value })} className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Ícone
                <select value={draft.icon ?? 'leaf'} onChange={(event) => setDraft({ ...draft, icon: event.target.value })} className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none">
                  {habitIconOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            </div>

            <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-600">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="size-4 accent-tea-700" />
              Hábito ativo
            </label>

            {error ? <p className="mt-4 text-sm font-semibold text-amber-700">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="h-11 rounded-full border border-tea-900/10 bg-white/70 px-5 text-sm font-semibold text-stone-600">
                Cancelar
              </button>
              <button type="submit" className="h-11 rounded-full bg-tea-700 px-6 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800">
                Salvar hábito
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
