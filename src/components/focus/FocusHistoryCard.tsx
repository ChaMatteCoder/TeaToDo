import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { FocusSession } from '../../types/focus';
import { FOCUS_PRESETS, formatDuration, formatSessionTime } from '../../utils/focus';

interface FocusHistoryCardProps {
  sessions: FocusSession[];
  onClear: () => void;
}

export function FocusHistoryCard({ sessions, onClear }: FocusHistoryCardProps) {
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(sessions.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleSessions = useMemo(() => sessions.slice(safePage * pageSize, safePage * pageSize + pageSize), [safePage, sessions]);

  return (
    <section className="rounded-[24px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-tea-950">Histórico recente</h2>
        <button type="button" onClick={onClear} className="text-sm font-semibold text-tea-700">
          Limpar histórico
        </button>
      </div>
      <div className="space-y-2">
        {visibleSessions.map((session) => (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-tea-50/60 px-4 py-3" key={session.id}>
            <span className={`grid size-9 place-items-center rounded-full ${session.completed ? 'bg-tea-100 text-tea-700' : 'bg-rose-50 text-rose-500'}`}>
              {session.completed ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">{session.taskTitle || FOCUS_PRESETS[session.preset]?.name || 'Sessão de foco'}</p>
              <p className="text-xs text-stone-500">
                {FOCUS_PRESETS[session.preset]?.name} • {formatDuration(session.durationSeconds)}
              </p>
            </div>
            <p className="text-sm text-stone-500">{formatSessionTime(session.startedAt)}</p>
          </div>
        ))}
        {!sessions.length ? <p className="rounded-3xl bg-tea-50/60 px-5 py-8 text-center font-display text-lg text-tea-900">Comece com uma xícara de foco.</p> : null}
      </div>
      {sessions.length > pageSize ? (
        <div className="mt-4 flex items-center justify-between border-t border-tea-900/10 pt-4">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-tea-700 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-stone-500">
            {safePage + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={safePage >= totalPages - 1}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-tea-700 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      ) : null}
    </section>
  );
}
