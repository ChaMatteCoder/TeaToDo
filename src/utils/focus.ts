import { isSameDay, parseISO } from 'date-fns';
import type { ActiveFocusSession, FocusMode, FocusPreset, FocusPresetId, FocusSession, FocusSettings } from '../types/focus';

export const FOCUS_PRESETS: Record<FocusPresetId, FocusPreset> = {
  chamomile: {
    id: 'chamomile',
    name: 'Camomila',
    description: 'Foco leve',
    focusMinutes: 15,
    shortBreakMinutes: 3,
    longBreakMinutes: 10,
    cyclesBeforeLongBreak: 4,
  },
  greenTea: {
    id: 'greenTea',
    name: 'Chá Verde',
    description: 'Foco clássico',
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha',
    description: 'Foco profundo',
    focusMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 20,
    cyclesBeforeLongBreak: 3,
  },
  blackTea: {
    id: 'blackTea',
    name: 'Chá Preto',
    description: 'Foco intenso',
    focusMinutes: 90,
    shortBreakMinutes: 15,
    longBreakMinutes: 30,
    cyclesBeforeLongBreak: 2,
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    description: 'Seu próprio ritmo',
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
  },
};

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = {
  preset: 'greenTea',
  customFocusMinutes: 25,
  customShortBreakMinutes: 5,
  customLongBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  autoStartBreak: false,
  autoStartNextFocus: false,
  soundEnabled: true,
  notificationsEnabled: false,
  dailyGoalMinutes: 120,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function getPresetDurationSeconds(settings: FocusSettings, mode: FocusMode) {
  const preset = FOCUS_PRESETS[settings.preset] ?? FOCUS_PRESETS.greenTea;
  if (settings.preset === 'custom') {
    if (mode === 'focus') return clamp(settings.customFocusMinutes, 1, 180) * 60;
    if (mode === 'shortBreak') return clamp(settings.customShortBreakMinutes, 1, 60) * 60;
    return clamp(settings.customLongBreakMinutes, 1, 90) * 60;
  }
  if (mode === 'focus') return preset.focusMinutes * 60;
  if (mode === 'shortBreak') return preset.shortBreakMinutes * 60;
  return preset.longBreakMinutes * 60;
}

export function getCyclesBeforeLongBreak(settings: FocusSettings) {
  if (settings.preset === 'custom') return clamp(settings.cyclesBeforeLongBreak, 1, 8);
  return FOCUS_PRESETS[settings.preset]?.cyclesBeforeLongBreak ?? 4;
}

export function getRemainingSeconds(activeSession: ActiveFocusSession | null, now = Date.now()) {
  if (!activeSession) return 0;
  const startedAt = parseISO(activeSession.startedAt).getTime();
  const pausedSeconds = activeSession.totalPausedSeconds + (!activeSession.isRunning && activeSession.pausedAt ? Math.floor((now - parseISO(activeSession.pausedAt).getTime()) / 1000) : 0);
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000) - pausedSeconds);
  return Math.max(0, activeSession.durationSeconds - elapsedSeconds);
}

export function formatTimer(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

export function getTodayFocusSessions(sessions: FocusSession[]) {
  const now = new Date();
  return sessions.filter((session) => session.completed && session.mode === 'focus' && isSameDay(parseISO(session.startedAt), now));
}

export function sumFocusSeconds(sessions: FocusSession[]) {
  return sessions.filter((session) => session.completed && session.mode === 'focus').reduce((sum, session) => sum + session.durationSeconds, 0);
}

export function formatSessionTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(parseISO(value));
}

export function playFocusBeep() {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.frequency.value = 620;
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.5);
}
