import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import cupAsset from '../../assets/05.png';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { formatDuration, formatTimer } from '../utils/focus';

export function FocusCard() {
  const { activeSession, remainingSeconds, selectedPreset, todayStats } = useFocusTimer();
  const hasReachedGoal = todayStats.focusedSeconds >= todayStats.goalSeconds && todayStats.goalSeconds > 0;
  const label = activeSession ? (activeSession.mode === 'focus' ? 'Sessão de foco' : activeSession.mode === 'shortBreak' ? 'Pausa curta' : 'Pausa longa') : 'Sessão de foco';

  return (
    <section className="relative overflow-hidden rounded-[22px] border border-tea-900/10 bg-gradient-to-br from-tea-50 to-tea-100/80 p-5 shadow-card">
      <h3 className="font-display text-2xl font-semibold text-tea-950">Foco</h3>
      <div className="mx-auto mt-3 grid size-20 place-items-center rounded-full bg-tea-200/70">
        <img src={cupAsset} alt="" className="w-16 opacity-90" />
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs text-stone-600">{label}</p>
        <p className="font-display text-4xl text-tea-900">{activeSession ? formatTimer(remainingSeconds) : `${selectedPreset.focusMinutes}:00`}</p>
        <p className="mt-1 text-xs font-semibold text-tea-700">{activeSession ? (activeSession.isRunning ? 'Em andamento' : 'Pausado') : selectedPreset.name}</p>
      </div>
      <Link className="mx-auto mt-3 flex h-10 min-w-[150px] items-center justify-center gap-3 rounded-full bg-tea-700 px-6 text-sm font-semibold text-white shadow-card" to="/foco">
        <span className="whitespace-nowrap">{activeSession ? 'Continuar' : 'Iniciar foco'}</span>
        <Play size={15} fill="currentColor" />
      </Link>
      <p className="mx-auto mt-5 max-w-[10rem] text-center text-sm leading-5 text-stone-600">
        {todayStats.completedSessions ? `Hoje: ${formatDuration(todayStats.focusedSeconds)} focados` : hasReachedGoal ? 'Meta do dia concluída. Respire e celebre.' : 'Comece com uma xícara de foco.'}
      </p>
      <svg className="absolute -right-5 -top-5 text-white/65" xmlns="http://www.w3.org/2000/svg" width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 0 1 7.38 16.75" />
        <path d="M12 6v6l4 2" />
        <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
        <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
        <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
        <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
      </svg>
    </section>
  );
}
