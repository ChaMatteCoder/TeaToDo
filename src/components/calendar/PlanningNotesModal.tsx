import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import type { PlanningNote } from '../../types/planningNote';

interface PlanningNotesModalProps {
  isOpen: boolean;
  notes: PlanningNote[];
  onClose: () => void;
  onAdd: (text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

export function PlanningNotesModal({ isOpen, notes, onClose, onAdd, onUpdate, onRemove }: PlanningNotesModalProps) {
  const [newNote, setNewNote] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setDrafts(Object.fromEntries(notes.map((note) => [note.id, note.text])));
    setNewNote('');
  }, [isOpen, notes]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    onAdd(newNote);
    setNewNote('');
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-tea-950/24 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            className="w-full max-w-xl rounded-[28px] border border-tea-900/10 bg-linen p-6 shadow-[0_24px_90px_rgba(47,61,36,0.24)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notes-modal-title"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="notes-modal-title" className="font-display text-3xl font-semibold text-tea-950">
                Notas de planejamento
              </h2>
              <button type="button" onClick={onClose} aria-label="Fechar modal de notas" className="grid size-10 place-items-center rounded-full border border-tea-900/10 bg-white/70 text-stone-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="mb-4 flex gap-2">
              <label className="sr-only" htmlFor="planning-note">
                Nova nota
              </label>
              <input
                id="planning-note"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                value={newNote}
                onChange={(event) => setNewNote(event.target.value)}
                placeholder="Adicionar lembrete de planejamento"
              />
              <button type="submit" aria-label="Adicionar nota" className="grid size-12 place-items-center rounded-full bg-tea-700 text-white">
                <Plus size={18} />
              </button>
            </form>
            <div className="space-y-3">
              {notes.map((note) => (
                <div className="grid grid-cols-[1fr_auto_auto] gap-2" key={note.id}>
                  <input className="h-11 rounded-2xl border border-tea-900/10 bg-white/78 px-4 text-sm outline-none" value={drafts[note.id] ?? ''} onChange={(event) => setDrafts({ ...drafts, [note.id]: event.target.value })} />
                  <button type="button" onClick={() => onUpdate(note.id, drafts[note.id] ?? '')} className="rounded-full bg-tea-100 px-4 text-sm font-semibold text-tea-700">
                    Salvar
                  </button>
                  <button type="button" onClick={() => onRemove(note.id)} aria-label="Excluir nota" className="grid size-11 place-items-center rounded-full bg-rose-50 text-rose-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {!notes.length ? <p className="rounded-3xl bg-tea-50/60 px-5 py-8 text-center font-display text-lg text-tea-900">Adicione lembretes para orientar sua semana.</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
