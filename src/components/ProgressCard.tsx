import { ChevronDown, Leaf } from 'lucide-react';
import { useState } from 'react';

export type ProgressStats = {
  total: number;
  completed: number;
  inProgress: number;
  productivity: number;
};

export type ProgressOption = {
  label: string;
  stats: ProgressStats;
};

interface ProgressCardProps {
  options: ProgressOption[];
}

export function ProgressCard({ options }: ProgressCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedOption = options[selectedIndex] ?? options[0];
  const stats = selectedOption.stats;
  const hasTasks = stats.total > 0;
  const progress = hasTasks ? stats.productivity : 0;
  const background = hasTasks ? `conic-gradient(var(--color-primary) ${progress}%, var(--color-surface-muted) 0)` : 'var(--color-surface-muted)';

  return (
    <section className="relative overflow-visible rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <h3 className="min-w-0 font-display text-2xl font-semibold leading-tight text-tea-950">Seu progresso</h3>
        <div className="relative shrink-0 justify-self-end">
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-8 max-w-[102px] items-center gap-1 rounded-full bg-linen/70 px-2.5 text-xs font-semibold text-stone-600 transition hover:bg-tea-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <span className="truncate">{selectedOption.label}</span>
            <ChevronDown size={13} className={`shrink-0 transition ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-2xl border border-tea-900/10 bg-white/95 p-1 text-xs shadow-soft backdrop-blur">
              {options.map((option, index) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsMenuOpen(false);
                  }}
                  className={`flex h-9 w-full items-center rounded-xl px-3 text-left font-semibold transition ${
                    selectedIndex === index ? 'bg-tea-700 text-white' : 'text-stone-600 hover:bg-tea-50 hover:text-tea-800'
                  }`}
                  role="menuitem"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="relative grid size-32 min-w-0 place-items-center rounded-full" style={{ background }} aria-label={`Progresso: ${stats.productivity}%`}>
          <div className="size-[94px] rounded-full bg-[color-mix(in_srgb,var(--color-surface)_92%,white)]" />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-4xl text-tea-800">{stats.productivity}%</p>
              <p className="text-[10px] text-stone-500">Produtividade</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center text-xs">
          <div className="grid min-h-[74px] min-w-0 place-items-center rounded-2xl bg-linen/70 px-1 py-3">
            <div>
            <p className="font-display text-2xl text-tea-900">{stats.completed}</p>
            <p className="mt-1 whitespace-nowrap text-[11px] text-stone-500">Concluídas</p>
            </div>
          </div>
          <div className="grid min-h-[74px] min-w-0 place-items-center rounded-2xl bg-linen/70 px-1 py-3">
            <div>
            <p className="font-display text-2xl text-tea-900">{stats.inProgress}</p>
            <p className="mt-1 text-[11px] leading-3 text-stone-500">Em<br />andamento</p>
            </div>
          </div>
          <div className="grid min-h-[74px] min-w-0 place-items-center rounded-2xl bg-linen/70 px-1 py-3">
            <div>
            <p className="font-display text-2xl text-tea-900">{stats.total}</p>
            <p className="mt-1 text-stone-500">Total</p>
            </div>
          </div>
        </div>
      </div>
      {!hasTasks ? (
        <p className="mt-5 flex items-center gap-2 text-sm font-medium text-stone-500">
          <Leaf size={17} className="text-tea-500" />
          Adicione sua primeira tarefa para começar.
        </p>
      ) : null}
    </section>
  );
}
