import type { HabitInput } from '../../types/habit';
import { habitCategoryLabels, habitPresets } from '../../utils/habits';
import { getHabitIcon } from './habitIcons';

interface HabitPresetsProps {
  onCreatePreset: (preset: HabitInput) => void;
}

const visiblePresets = ['water', 'meditate', 'exercise', 'study', 'plan-day', 'desk'];

export function HabitPresets({ onCreatePreset }: HabitPresetsProps) {
  return (
    <section className="rounded-[30px] border border-tea-900/10 bg-white/72 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-tea-900">Presets para começar</h2>
          <p className="mt-1 text-sm text-stone-500">Rituais prontos para virar rotina em poucos cliques.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {habitPresets.filter((preset) => visiblePresets.includes(preset.presetId)).map((preset) => {
          const Icon = getHabitIcon(preset.icon);
          return (
            <button
              key={preset.presetId}
              type="button"
              onClick={() => onCreatePreset(preset)}
              className="group min-w-0 rounded-3xl border border-tea-900/10 bg-linen/72 p-4 text-left transition hover:-translate-y-0.5 hover:bg-tea-50"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-tea-100 text-tea-700">
                <Icon size={20} />
              </span>
              <h3 className="mt-3 truncate font-display text-xl font-semibold text-tea-900">{preset.title}</h3>
              <p className="mt-1 text-xs font-semibold text-stone-500">{habitCategoryLabels[preset.category]}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
