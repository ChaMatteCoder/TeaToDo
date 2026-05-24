import type { FocusCompletionState } from '../../types/focus';

interface FocusCompletedPanelProps {
  completionState: FocusCompletionState;
  hasLinkedTask: boolean;
  onStartBreak: () => void;
  onStartFocus: () => void;
  onCompleteTask: () => void;
}

export function FocusCompletedPanel({ completionState, hasLinkedTask, onStartBreak, onStartFocus, onCompleteTask }: FocusCompletedPanelProps) {
  if (!completionState || completionState.session.mode !== 'focus' || completionState.session.interrupted) return null;

  return (
    <section className="rounded-[24px] border border-tea-900/10 bg-gradient-to-r from-oat/70 to-tea-50 p-5 shadow-card xl:col-span-12">
      <h2 className="font-display text-2xl font-semibold text-tea-950">Sessão concluída. Hora de respirar.</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={onStartBreak} className="rounded-full bg-tea-700 px-5 py-3 text-sm font-semibold text-white">
          Iniciar pausa
        </button>
        <button type="button" onClick={onStartFocus} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-tea-700">
          Novo foco
        </button>
        {hasLinkedTask ? (
          <button type="button" onClick={onCompleteTask} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-tea-700">
            Marcar tarefa como concluída
          </button>
        ) : null}
      </div>
    </section>
  );
}
