import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InterruptFocusModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function InterruptFocusModal({ isOpen, onCancel, onConfirm }: InterruptFocusModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-tea-950/25 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onCancel}>
          <motion.div
            className="w-full max-w-md rounded-[28px] border border-tea-900/10 bg-linen p-6 shadow-[0_24px_90px_rgba(47,61,36,0.24)]"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="interrupt-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">Interromper foco</p>
                <h2 id="interrupt-title" className="mt-1 font-display text-3xl font-semibold text-tea-950">
                  Pausar o ritual agora?
                </h2>
              </div>
              <button type="button" onClick={onCancel} aria-label="Cancelar interrupção" className="grid size-10 place-items-center rounded-full border border-tea-900/10 bg-white/70 text-stone-500">
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-600">Esta sessão será salva como interrompida no histórico. Você pode começar outra quando estiver pronto.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-tea-700">
                Continuar focando
              </button>
              <button type="button" onClick={onConfirm} className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white">
                Interromper sessão
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
