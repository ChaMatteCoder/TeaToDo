import { CheckCircle2, Flame, Sprout, TrendingUp } from 'lucide-react';

interface HabitSummaryCardsProps {
  totalToday: number;
  completedToday: number;
  weeklyPercent: number;
  bestStreak: number;
}

export function HabitSummaryCards({ totalToday, completedToday, weeklyPercent, bestStreak }: HabitSummaryCardsProps) {
  const cards = [
    { label: 'Hábitos de hoje', value: `${completedToday} de ${totalToday}`, icon: Sprout },
    { label: 'Concluídos hoje', value: completedToday, icon: CheckCircle2 },
    { label: 'Consistência semanal', value: `${weeklyPercent}%`, icon: TrendingUp },
    { label: 'Melhor sequência', value: `${bestStreak} dias`, icon: Flame },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="min-w-0 overflow-hidden rounded-[28px] border border-tea-900/10 bg-white/74 p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tea-600">{card.label}</p>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tea-100 text-tea-700">
              <card.icon size={18} />
            </span>
          </div>
          <p className="mt-4 truncate font-display text-3xl font-semibold text-tea-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
