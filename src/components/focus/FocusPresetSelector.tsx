import type { FocusPresetId, FocusSettings } from '../../types/focus';
import { FOCUS_PRESETS } from '../../utils/focus';
import { focusPresetAssets } from '../../utils/focusAssets';

interface FocusPresetSelectorProps {
  settings: FocusSettings;
  hasActiveSession: boolean;
  onChange: (preset: FocusPresetId) => void;
}

export function FocusPresetSelector({ settings, hasActiveSession, onChange }: FocusPresetSelectorProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[24px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <h2 className="font-display text-2xl font-semibold text-tea-950">Rituais de chá</h2>
      <div className="mt-4 grid gap-2">
        {Object.values(FOCUS_PRESETS).map((preset) => (
          <button
            type="button"
            key={preset.id}
            disabled={hasActiveSession}
            onClick={() => onChange(preset.id)}
            className={`min-w-0 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/30 ${
              settings.preset === preset.id ? 'border-tea-600 bg-tea-100/75' : 'border-tea-900/10 bg-white/70 hover:bg-tea-50'
            } ${hasActiveSession ? 'opacity-60' : ''}`}
          >
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-tea-50">
                <img src={focusPresetAssets[preset.id]} alt="" className="max-h-8 max-w-8 object-contain" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-stone-800">{preset.name}</p>
                <p className="mt-1 truncate text-xs text-stone-500">{preset.description}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-tea-700">{preset.focusMinutes}min</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
