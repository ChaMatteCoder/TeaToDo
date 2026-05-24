import { Flag, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriorityCardsProps {
  counts: {
    high: number;
    medium: number;
    low: number;
  };
}

const cards = [
  { key: 'high', label: 'Alta', className: 'from-tea-100 to-tea-50 text-tea-700', flag: 'fill-tea-600 text-tea-600' },
  { key: 'medium', label: 'Média', className: 'from-amber-100 to-orange-50 text-amber-700', flag: 'fill-amber-500 text-amber-500' },
  { key: 'low', label: 'Baixa', className: 'from-stone-100 to-tea-50 text-stone-600', flag: 'fill-stone-400 text-stone-400' },
] as const;

export function PriorityCards({ counts }: PriorityCardsProps) {
  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card xl:col-span-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold text-tea-950">Prioridades de hoje</h3>
        <p className="text-xs font-medium text-stone-400">tarefas do dia</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card, index) => (
          <motion.div
            className={`relative min-h-[118px] overflow-hidden rounded-2xl border border-tea-900/10 bg-gradient-to-br p-4 ${card.className}`}
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Flag size={14} className={card.flag} />
              {card.label}
            </div>
            <p className="mt-4 font-display text-3xl text-tea-900">{counts[card.key]}</p>
            <p className="text-xs text-stone-600">{counts[card.key] === 1 ? 'tarefa' : 'tarefas'}</p>
            <Leaf className="absolute bottom-2 right-2 text-current opacity-20" size={58} strokeWidth={1.2} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
