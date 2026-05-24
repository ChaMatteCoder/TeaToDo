import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, SkipForward, Square } from 'lucide-react';
import type { ActiveFocusSession, FocusMode, FocusPreset } from '../../types/focus';
import { focusPresetAssets } from '../../utils/focusAssets';
import { formatTimer } from '../../utils/focus';

interface FocusTimerCardProps {
  activeSession: ActiveFocusSession | null;
  remainingSeconds: number;
  progressPercent: number;
  selectedPreset: FocusPreset;
  cyclesBeforeLongBreak: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
  onSkipBreak: () => void;
}

const modeLabel: Record<FocusMode, string> = {
  focus: 'Sessão de foco',
  shortBreak: 'Pausa curta',
  longBreak: 'Pausa longa',
};

export function FocusTimerCard({
  activeSession,
  remainingSeconds,
  progressPercent,
  selectedPreset,
  cyclesBeforeLongBreak,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
  onSkipBreak,
}: FocusTimerCardProps) {
  const mode = activeSession?.mode ?? 'focus';
  const circumference = 2 * Math.PI * 116;
  const offset = circumference - (progressPercent / 100) * circumference;
  const iconAsset = focusPresetAssets[selectedPreset.id];

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[30px] border border-tea-900/10 bg-gradient-to-br from-white/88 via-linen to-tea-50 p-6 shadow-soft">
      <div className="absolute -right-10 -top-10 size-44 rounded-full bg-tea-100/70 blur-2xl" />
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea-600">{modeLabel[mode]}</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-tea-950">{formatTimer(remainingSeconds)}</h2>
          <p className="mt-2 text-sm text-stone-500">
            {selectedPreset.name} • Ciclo {(activeSession?.currentCycle ?? 0) + 1} de {cyclesBeforeLongBreak}
          </p>
          {activeSession?.taskTitle ? <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-stone-700">Tarefa: {activeSession.taskTitle}</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {!activeSession ? (
              <motion.button type="button" onClick={onStart} className="flex h-12 items-center gap-2 rounded-full bg-tea-700 px-6 text-sm font-semibold text-white shadow-card" whileHover={{ y: -1 }} aria-label="Iniciar foco">
                <Play size={17} fill="currentColor" />
                Iniciar foco
              </motion.button>
            ) : activeSession.isRunning ? (
              <>
                <button type="button" onClick={onPause} className="flex h-12 items-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white" aria-label="Pausar sessão">
                  <Pause size={17} /> Pausar
                </button>
                <button type="button" onClick={onFinish} className="flex h-12 items-center gap-2 rounded-full border border-tea-900/10 bg-white px-5 text-sm font-semibold text-stone-600" aria-label="Finalizar sessão">
                  <Square size={15} /> Finalizar
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onResume} className="flex h-12 items-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white" aria-label="Retomar sessão">
                  <Play size={17} fill="currentColor" /> Retomar
                </button>
                <button type="button" onClick={onReset} className="flex h-12 items-center gap-2 rounded-full border border-tea-900/10 bg-white px-5 text-sm font-semibold text-stone-600" aria-label="Reiniciar sessão">
                  <RotateCcw size={16} /> Reiniciar
                </button>
                <button type="button" onClick={onFinish} className="flex h-12 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-600" aria-label="Finalizar sessão">
                  <Square size={15} /> Finalizar
                </button>
              </>
            )}
            {activeSession && activeSession.mode !== 'focus' ? (
              <button type="button" onClick={onSkipBreak} className="flex h-12 items-center gap-2 rounded-full border border-tea-900/10 bg-white px-5 text-sm font-semibold text-stone-600">
                <SkipForward size={16} /> Pular pausa
              </button>
            ) : null}
          </div>
        </div>
        <div className="relative mx-auto grid size-60 place-items-center sm:size-64">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 260 260" aria-hidden="true">
            <circle cx="130" cy="130" r="116" stroke="#e6e0d3" strokeWidth="16" fill="none" />
            <motion.circle cx="130" cy="130" r="116" stroke="#6f844f" strokeWidth="16" fill="none" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.4 }} />
          </svg>
          <div className="grid size-36 place-items-center rounded-full bg-tea-100/80">
            <motion.img
              src={iconAsset}
              alt=""
              className="max-h-28 max-w-28 object-contain"
              animate={activeSession?.isRunning ? { y: [0, -5, 0], rotate: [0, 1.5, -1.5, 0] } : { y: 0, rotate: 0 }}
              transition={activeSession?.isRunning ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
