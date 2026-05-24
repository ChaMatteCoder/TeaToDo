export type FocusMode = 'focus' | 'shortBreak' | 'longBreak';

export type FocusPresetId = 'chamomile' | 'greenTea' | 'matcha' | 'blackTea' | 'custom';

export type FocusPreset = {
  id: FocusPresetId;
  name: string;
  description: string;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
};

export type FocusSession = {
  id: string;
  taskId?: string | null;
  taskTitle?: string | null;
  mode: FocusMode;
  preset: FocusPresetId;
  durationSeconds: number;
  startedAt: string;
  endedAt?: string | null;
  completed: boolean;
  interrupted: boolean;
};

export type FocusSettings = {
  preset: FocusPresetId;
  customFocusMinutes: number;
  customShortBreakMinutes: number;
  customLongBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartNextFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  dailyGoalMinutes: number;
};

export type ActiveFocusSession = {
  id: string;
  taskId?: string | null;
  taskTitle?: string | null;
  mode: FocusMode;
  preset: FocusPresetId;
  durationSeconds: number;
  startedAt: string;
  pausedAt?: string | null;
  totalPausedSeconds: number;
  isRunning: boolean;
  currentCycle: number;
};

export type FocusCompletionState = {
  session: FocusSession;
  nextBreakMode?: 'shortBreak' | 'longBreak';
  nextCycle?: number;
} | null;
