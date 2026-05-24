export type TeaThemeId = 'matcha' | 'blackTea' | 'jasmine' | 'oolong' | 'chai';

export type CardStyle = 'soft' | 'defined' | 'minimal';

export type FontScale = 90 | 100 | 110 | 120;

export type InterfaceDensity = 'compact' | 'comfortable' | 'airy';

export type IconShape = 'rounded' | 'soft' | 'square';

export type FocusPresetPreference = 'short' | 'deep' | 'long' | 'custom';

export type WallpaperId = 'teaCup' | 'mountains' | 'botanical' | 'paper' | 'none' | 'custom';

export type NotificationPreferences = {
  taskReminders: boolean;
  dailySummaryEmail: boolean;
  focusNotifications: boolean;
  habitsAndGoals: boolean;
};

export type UserProfile = {
  displayName: string;
  email: string;
  timezone: string;
  language: 'pt-BR' | 'en-US';
  avatarUrl?: string | null;
  initials?: string;
};

export type TeaToDoPreferences = {
  theme: TeaThemeId;
  cardStyle: CardStyle;
  fontScale: FontScale;
  density: InterfaceDensity;
  iconShape: IconShape;
  focusPreset: FocusPresetPreference;
  wallpaper: WallpaperId;
  customWallpaperDataUrl?: string | null;
  notifications: NotificationPreferences;
  profile: UserProfile;
  updatedAt: string;
};
