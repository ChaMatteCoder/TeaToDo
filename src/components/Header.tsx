import { Bell, CupSoda, Leaf, Menu, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePreferences } from '../hooks/usePreferences';
import { HangingTag } from './HangingTag';

export function Header() {
  const { preferences } = usePreferences();
  const displayName = preferences.profile.displayName?.trim() || 'Chá';
  const firstName = displayName.split(/\s+/)[0] || displayName;
  const hour = Number(
    new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      hour12: false,
      timeZone: preferences.profile.timezone || undefined,
    }).format(new Date()),
  );
  const greeting = hour < 5 ? 'Boa madrugada' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <header className="relative flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <h2 className="font-display text-4xl font-semibold leading-tight text-tea-900 sm:text-5xl">
          {greeting}, {firstName} <Leaf className="mb-2 inline text-tea-500" size={31} />
        </h2>
        <p className="mt-3 text-base text-stone-500">Pequenas escolhas, grandes mudanças.</p>
      </motion.div>

      <HangingTag />

      <div className="flex items-center gap-3 self-end md:self-start">
        {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
          <motion.button
            aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'}
            className="grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card transition hover:border-tea-500/30 hover:bg-tea-50"
            key={index}
            type="button"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon size={20} />
          </motion.button>
        ))}
        <button className="grid size-12 place-items-center rounded-full bg-tea-700 text-white shadow-card lg:hidden" type="button" aria-label="Menu">
          <Menu size={21} />
        </button>
      </div>
    </header>
  );
}
