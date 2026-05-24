import type { FocusSettings } from '../../types/focus';

interface FocusSettingsCardProps {
  settings: FocusSettings;
  onUpdate: (changes: Partial<FocusSettings>) => void;
}

export function FocusSettingsCard({ settings, onUpdate }: FocusSettingsCardProps) {
  const updateNumber = (key: keyof FocusSettings, value: string) => onUpdate({ [key]: Number(value) } as Partial<FocusSettings>);

  return (
    <section className="rounded-[24px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <h2 className="font-display text-2xl font-semibold text-tea-950">Configurações</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-stone-700">
          Meta diária em minutos
          <input type="number" min={5} max={600} value={settings.dailyGoalMinutes} onChange={(event) => updateNumber('dailyGoalMinutes', event.target.value)} className="h-10 rounded-2xl border border-tea-900/10 bg-white px-3 outline-none" />
        </label>
        {[
          ['autoStartBreak', 'Auto iniciar pausa'],
          ['autoStartNextFocus', 'Auto iniciar próximo foco'],
          ['soundEnabled', 'Som ligado'],
          ['notificationsEnabled', 'Notificações'],
        ].map(([key, label]) => (
          <label className="flex items-center justify-between rounded-2xl bg-tea-50/70 px-4 py-3 text-sm font-semibold text-stone-700" key={key}>
            {label}
            <input type="checkbox" checked={Boolean(settings[key as keyof FocusSettings])} onChange={(event) => onUpdate({ [key]: event.target.checked } as Partial<FocusSettings>)} />
          </label>
        ))}
        <div className="grid grid-cols-2 gap-2 lg:col-span-2">
          <label className="grid gap-1 text-xs font-semibold text-stone-600">
            Foco
            <input type="number" min={1} max={180} value={settings.customFocusMinutes} onChange={(event) => updateNumber('customFocusMinutes', event.target.value)} className="h-10 rounded-2xl border border-tea-900/10 bg-white px-3 outline-none" />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-stone-600">
            Pausa curta
            <input type="number" min={1} max={60} value={settings.customShortBreakMinutes} onChange={(event) => updateNumber('customShortBreakMinutes', event.target.value)} className="h-10 rounded-2xl border border-tea-900/10 bg-white px-3 outline-none" />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-stone-600">
            Pausa longa
            <input type="number" min={1} max={90} value={settings.customLongBreakMinutes} onChange={(event) => updateNumber('customLongBreakMinutes', event.target.value)} className="h-10 rounded-2xl border border-tea-900/10 bg-white px-3 outline-none" />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-stone-600">
            Ciclos
            <input type="number" min={1} max={8} value={settings.cyclesBeforeLongBreak} onChange={(event) => updateNumber('cyclesBeforeLongBreak', event.target.value)} className="h-10 rounded-2xl border border-tea-900/10 bg-white px-3 outline-none" />
          </label>
        </div>
      </div>
    </section>
  );
}
