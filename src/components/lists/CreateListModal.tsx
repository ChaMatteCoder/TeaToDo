import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckSquare, ShoppingCart, X } from 'lucide-react';
import type { SmartListInput, SmartListType } from '../../types/smartList';

interface CreateListModalProps {
  isOpen: boolean;
  initialType?: SmartListType;
  onClose: () => void;
  onCreate: (input: SmartListInput) => void;
}

const typeOptions: Array<{ type: SmartListType; title: string; description: string; icon: typeof CheckSquare }> = [
  { type: 'simple', title: 'Lista simples', description: 'Checklist leve para ideias, rotinas e pendências.', icon: CheckSquare },
  { type: 'shopping', title: 'Lista de compras', description: 'Some produtos e acompanhe o que já foi comprado.', icon: ShoppingCart },
  { type: 'study', title: 'Lista de estudos', description: 'Organize tópicos, revisões e avanço por disciplina.', icon: BookOpen },
];

export function CreateListModal({ isOpen, initialType = 'simple', onClose, onCreate }: CreateListModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<SmartListType>(initialType);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle('');
    setDescription('');
    setType(initialType);
    setError('');
  }, [initialType, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Dê um nome para a lista.');
      return;
    }
    onCreate({ title: cleanTitle, description: description.trim(), type });
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
            className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-tea-900/10 bg-linen p-6 shadow-soft"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-tea-900">Nova lista</h2>
                <p className="mt-1 text-sm text-stone-500">Escolha um preset e comece com calma.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Fechar modal" className="grid size-10 place-items-center rounded-full border border-tea-900/10 bg-white/75 text-stone-500">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Nome da lista
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 text-base font-medium outline-none transition focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10"
                  placeholder="Ex.: Compras da semana"
                  autoFocus
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-tea-900">
                Descrição opcional
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-24 resize-none rounded-2xl border border-tea-900/10 bg-white/78 px-4 py-3 text-sm outline-none transition focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10"
                  placeholder="Um lembrete curto sobre o objetivo desta lista."
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {typeOptions.map((option) => {
                const Icon = option.icon;
                const active = type === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setType(option.type)}
                    className={`min-w-0 rounded-3xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30 ${
                      active ? 'border-tea-600 bg-tea-100/70 text-tea-900 shadow-card' : 'border-tea-900/10 bg-white/66 text-stone-600 hover:border-tea-500/30'
                    }`}
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-linen text-tea-700">
                      <Icon size={20} />
                    </span>
                    <span className="mt-3 block font-display text-xl font-semibold">{option.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-stone-500">{option.description}</span>
                  </button>
                );
              })}
            </div>

            {error ? <p className="mt-4 text-sm font-semibold text-amber-700">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="h-11 rounded-full border border-tea-900/10 bg-white/70 px-5 text-sm font-semibold text-stone-600">
                Cancelar
              </button>
              <button type="submit" className="h-11 rounded-full bg-tea-700 px-6 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800">
                Criar lista
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
