import { Target } from 'lucide-react';
import { formatDuration } from '../../utils/focus';

interface FocusStatsCardProps {
  focusedSeconds: number;
  completedSessions: number;
  cycles: number;
  goalSeconds: number;
  goalPercent: number;
}

export function FocusStatsCard({ focusedSeconds, completedSessions, cycles, goalSeconds, goalPercent }: FocusStatsCardProps) {
  return (
    <section className="rounded-[24px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Hoje</h2>
        <Target className="text-tea-600" size={20} />
      </div>
      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[auto_1fr]">
        <p className="font-display text-3xl text-tea-800">{formatDuration(focusedSeconds)} focados</p>
        <div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Meta: {formatDuration(goalSeconds)}</span>
            <span>{goalPercent}%</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-oat">
            <div className="h-full rounded-full bg-tea-600" style={{ width: `${goalPercent}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-tea-50 px-3 py-2">
          <p className="text-stone-500">Sessões</p>
          <p className="font-bold text-tea-900">{completedSessions}</p>
        </div>
        <div className="rounded-2xl bg-tea-50 px-3 py-2">
          <p className="text-stone-500">Ciclos</p>
          <p className="font-bold text-tea-900">{cycles}</p>
        </div>
      </div>
    </section>
  );
}
