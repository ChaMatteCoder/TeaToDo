import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { getTeaTheme } from '../config/themes';
import type { TeaToDoPreferences } from '../types/preferences';
import { DEFAULT_PREFERENCES } from '../config/preferences';
import teaCupAsset from '../../assets/02.png';
import mountainAsset from '../../assets/01.png';
import botanicalAsset from '../../assets/04.png';
import paperAsset from '../../assets/05.png';

const STORAGE_KEY = 'teatodo:preferences';

type PreferencesContextValue = {
  preferences: TeaToDoPreferences;
  updatePreferences: (changes: Partial<TeaToDoPreferences>) => void;
  resetPreferences: () => void;
  savePreferences: () => void;
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'C';

function normalizePreferences(value: unknown): TeaToDoPreferences {
  if (!value || typeof value !== 'object') return DEFAULT_PREFERENCES;
  const item = value as Partial<TeaToDoPreferences>;
  const profile = { ...DEFAULT_PREFERENCES.profile, ...item.profile };
  return {
    ...DEFAULT_PREFERENCES,
    ...item,
    notifications: { ...DEFAULT_PREFERENCES.notifications, ...item.notifications },
    profile: {
      ...profile,
      displayName: profile.displayName?.trim() || DEFAULT_PREFERENCES.profile.displayName,
      initials: profile.initials || getInitials(profile.displayName || DEFAULT_PREFERENCES.profile.displayName),
    },
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
  };
}

function readPreferences() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return normalizePreferences(JSON.parse(stored));
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function syncFocusPreset(preferences: TeaToDoPreferences) {
  try {
    const syncKey = 'teatodo:focus-preferences-sync';
    const syncState = JSON.stringify({
      focusPreset: preferences.focusPreset,
      focusNotifications: preferences.notifications.focusNotifications,
    });
    if (window.localStorage.getItem(syncKey) === syncState) return;

    const stored = window.localStorage.getItem('teatodo:focus-settings');
    const settings = stored ? JSON.parse(stored) : {};
    const presetMap = {
      short: 'chamomile',
      deep: 'greenTea',
      long: 'blackTea',
      custom: 'custom',
    } as const;
    window.localStorage.setItem(
      'teatodo:focus-settings',
      JSON.stringify({ ...settings, preset: presetMap[preferences.focusPreset], notificationsEnabled: preferences.notifications.focusNotifications }),
    );
    window.localStorage.setItem(syncKey, syncState);
  } catch {
    // Keep preferences independent if legacy focus settings are unavailable.
  }
}

function applyPreferences(preferences: TeaToDoPreferences) {
  const theme = getTeaTheme(preferences.theme);
  const root = document.documentElement;
  const wallpaperUrl =
    preferences.wallpaper === 'custom'
      ? preferences.customWallpaperDataUrl
      : preferences.wallpaper === 'teaCup'
        ? teaCupAsset
        : preferences.wallpaper === 'mountains'
          ? mountainAsset
          : preferences.wallpaper === 'botanical'
            ? botanicalAsset
            : preferences.wallpaper === 'paper'
              ? paperAsset
              : null;
  root.dataset.theme = preferences.theme;
  root.dataset.cardStyle = preferences.cardStyle;
  root.dataset.density = preferences.density;
  root.dataset.iconShape = preferences.iconShape;
  root.style.setProperty('--color-bg', theme.tokens.background);
  root.style.setProperty('--color-surface', theme.tokens.surface);
  root.style.setProperty('--color-surface-muted', theme.tokens.surfaceMuted);
  root.style.setProperty('--color-primary', theme.tokens.primary);
  root.style.setProperty('--color-primary-dark', theme.tokens.primaryDark);
  root.style.setProperty('--color-accent', theme.tokens.accent);
  root.style.setProperty('--color-text', theme.tokens.text);
  root.style.setProperty('--color-muted', theme.tokens.textMuted);
  root.style.setProperty('--color-border', theme.tokens.border);
  root.style.setProperty('--color-success', theme.tokens.success);
  root.style.setProperty('--color-warning', theme.tokens.warning);
  root.style.setProperty('--font-scale', `${preferences.fontScale / 100}`);
  root.style.setProperty('--card-radius', preferences.cardStyle === 'soft' ? '30px' : preferences.cardStyle === 'defined' ? '22px' : '14px');
  root.style.setProperty('--card-shadow', preferences.cardStyle === 'minimal' ? 'none' : preferences.cardStyle === 'defined' ? '0 8px 22px rgba(89, 74, 49, 0.04)' : '0 12px 30px rgba(89, 74, 49, 0.07)');
  root.style.setProperty('--icon-radius', preferences.iconShape === 'rounded' ? '999px' : preferences.iconShape === 'soft' ? '16px' : '8px');
  root.style.setProperty('--density-pad', preferences.density === 'compact' ? '0.82' : preferences.density === 'comfortable' ? '0.94' : '1');
  root.style.setProperty('--custom-wallpaper', wallpaperUrl ? `url("${wallpaperUrl}")` : 'none');
  root.style.setProperty('--wallpaper-opacity', wallpaperUrl ? '0.055' : '0');
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<TeaToDoPreferences>(readPreferences);

  useEffect(() => {
    applyPreferences(preferences);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    syncFocusPreset(preferences);
  }, [preferences]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      updatePreferences: (changes) => {
        setPreferences((current) => {
          const nextProfile = changes.profile ? { ...current.profile, ...changes.profile } : current.profile;
          return normalizePreferences({
            ...current,
            ...changes,
            profile: nextProfile,
            notifications: changes.notifications ? { ...current.notifications, ...changes.notifications } : current.notifications,
            updatedAt: new Date().toISOString(),
          });
        });
      },
      resetPreferences: () => setPreferences({ ...DEFAULT_PREFERENCES, updatedAt: new Date().toISOString() }),
      savePreferences: () => setPreferences((current) => ({ ...current, updatedAt: new Date().toISOString() })),
    }),
    [preferences],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
