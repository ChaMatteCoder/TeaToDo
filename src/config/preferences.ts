import type { TeaToDoPreferences } from '../types/preferences';

export const DEFAULT_PREFERENCES: TeaToDoPreferences = {
  theme: 'matcha',
  cardStyle: 'soft',
  fontScale: 100,
  density: 'airy',
  iconShape: 'rounded',
  focusPreset: 'deep',
  wallpaper: 'teaCup',
  customWallpaperDataUrl: null,
  notifications: {
    taskReminders: true,
    dailySummaryEmail: false,
    focusNotifications: false,
    habitsAndGoals: true,
  },
  profile: {
    displayName: 'Chá',
    email: '',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    avatarUrl: null,
    initials: 'C',
  },
  updatedAt: new Date().toISOString(),
};
