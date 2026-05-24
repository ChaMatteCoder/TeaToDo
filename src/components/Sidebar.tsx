import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Home,
  ListTodo,
  Settings,
  Sprout,
  Timer,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import cupAsset from '../../assets/02.png';
import { usePreferences } from '../hooks/usePreferences';

const menu = [
  { label: 'Hoje', icon: Home, to: '/' },
  { label: 'Listas', icon: ListTodo, to: '/listas' },
  { label: 'Calendário', icon: CalendarDays, to: '/calendario' },
  { label: 'Foco', icon: Timer, to: '/foco' },
  { label: 'Hábitos', icon: CheckCircle2, to: '/habitos' },
  { label: 'Personalizar', icon: Settings, to: '/personalizar' },
];

export function Sidebar() {
  const { preferences } = usePreferences();
  const profileName = preferences.profile.displayName || 'Chá';
  const initials = preferences.profile.initials || profileName.slice(0, 1).toUpperCase();

  return (
    <aside className="hidden min-h-screen w-[284px] shrink-0 border-r border-tea-900/10 bg-linen/86 px-7 py-9 shadow-[8px_0_40px_rgba(64,85,44,0.04)] backdrop-blur lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-tea-100 text-tea-700">
          <Sprout size={25} />
        </span>
        <h1 className="font-display text-3xl font-semibold text-tea-900">TeaToDo</h1>
      </div>

      <nav className="mt-12 space-y-3">
        {menu.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `group flex h-14 w-full items-center gap-4 rounded-2xl px-5 text-left text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30 ${
                isActive && (item.to !== '/' || item.label === 'Hoje')
                  ? 'bg-gradient-to-r from-tea-200/80 to-tea-100/55 text-tea-800 shadow-card'
                  : 'text-stone-600 hover:bg-tea-50 hover:text-tea-800'
              }`
            }
            key={item.label}
            end={item.to === '/'}
            to={item.to}
          >
            <item.icon size={21} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="relative mx-auto mb-8 flex min-h-[310px] flex-col items-center justify-end overflow-hidden rounded-[30px] bg-gradient-to-b from-transparent via-tea-50/60 to-oat/50 px-4 pb-8 text-center">
          <img className="absolute bottom-24 left-1/2 w-56 -translate-x-1/2 opacity-95" src={cupAsset} alt="" />
          <p className="relative z-10 font-display text-lg leading-6 text-tea-800">
            Respire. Planeje.
            <br />
            Uma tarefa de cada vez.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-tea-900/10 bg-white/62 p-4 shadow-card">
          <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-tea-600 text-sm font-semibold text-white">
            {preferences.profile.avatarUrl ? <img src={preferences.profile.avatarUrl} alt="Avatar" className="size-full object-cover" /> : initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-tea-900">{profileName}</p>
            <p className="text-xs font-medium text-clay">Perfil standard</p>
          </div>
          <ChevronDown size={18} className="text-stone-500" />
        </div>
      </div>

      <div className="fixed bottom-4 left-4 flex items-center gap-2 text-xs text-stone-400 lg:hidden">
        <CircleUserRound size={16} />
        TeaToDo
      </div>
    </aside>
  );
}
