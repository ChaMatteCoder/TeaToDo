import { CalendarDays, CheckCircle2, Home, ListTodo, Settings, Timer } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Hoje', icon: Home, to: '/' },
  { label: 'Listas', icon: ListTodo, to: '/listas' },
  { label: 'Agenda', icon: CalendarDays, to: '/calendario' },
  { label: 'Foco', icon: Timer, to: '/foco' },
  { label: 'Hábitos', icon: CheckCircle2, to: '/habitos' },
  { label: 'Ajustes', icon: Settings, to: '/personalizar' },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-6 rounded-3xl border border-tea-900/10 bg-linen/92 p-2 shadow-soft backdrop-blur lg:hidden">
      {items.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `grid place-items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30 ${
              isActive && (item.to !== '/' || item.label === 'Hoje') ? 'bg-tea-600 text-white' : 'text-stone-500'
            }`
          }
          key={item.label}
          end={item.to === '/'}
          to={item.to}
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
