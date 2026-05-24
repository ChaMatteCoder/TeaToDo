import { useCallback, useEffect, useMemo, useState } from 'react';
import { isSameDay, parseISO, startOfWeek } from 'date-fns';
import type { ActiveFocusSession, FocusCompletionState, FocusSession, FocusSettings } from '../types/focus';
import type { Task } from '../types/task';
import {
  DEFAULT_FOCUS_SETTINGS,
  FOCUS_PRESETS,
  clamp,
  getCyclesBeforeLongBreak,
  getPresetDurationSeconds,
  getRemainingSeconds,
  getTodayFocusSessions,
  playFocusBeep,
  sumFocusSeconds,
} from '../utils/focus';

const SESSIONS_KEY = 'teatodo:focus-sessions';
const SETTINGS_KEY = 'teatodo:focus-settings';
const ACTIVE_KEY = 'teatodo:active-focus-session';
const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeSettings = (settings: Partial<FocusSettings>): FocusSettings => ({
  ...DEFAULT_FOCUS_SETTINGS,
  ...settings,
  customFocusMinutes: clamp(settings.customFocusMinutes ?? DEFAULT_FOCUS_SETTINGS.customFocusMinutes, 1, 180),
  customShortBreakMinutes: clamp(settings.customShortBreakMinutes ?? DEFAULT_FOCUS_SETTINGS.customShortBreakMinutes, 1, 60),
  customLongBreakMinutes: clamp(settings.customLongBreakMinutes ?? DEFAULT_FOCUS_SETTINGS.customLongBreakMinutes, 1, 90),
  cyclesBeforeLongBreak: clamp(settings.cyclesBeforeLongBreak ?? DEFAULT_FOCUS_SETTINGS.cyclesBeforeLongBreak, 1, 8),
  dailyGoalMinutes: clamp(settings.dailyGoalMinutes ?? DEFAULT_FOCUS_SETTINGS.dailyGoalMinutes, 5, 600),
});

export function useFocusTimer() {
  const [sessions, setSessions] = useState<FocusSession[]>(() => readJson<FocusSession[]>(SESSIONS_KEY, []));
  const [settings, setSettings] = useState<FocusSettings>(() => normalizeSettings(readJson<Partial<FocusSettings>>(SETTINGS_KEY, DEFAULT_FOCUS_SETTINGS)));
  const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(() => readJson<ActiveFocusSession | null>(ACTIVE_KEY, null));
  const [tick, setTick] = useState(Date.now());
  const [completionState, setCompletionState] = useState<FocusCompletionState>(null);

  useEffect(() => {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeSession) window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeSession));
    else window.localStorage.removeItem(ACTIVE_KEY);
  }, [activeSession]);

  useEffect(() => {
    const interval = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const selectedPreset = FOCUS_PRESETS[settings.preset] ?? FOCUS_PRESETS.greenTea;
  const remainingSeconds = activeSession ? getRemainingSeconds(activeSession, tick) : getPresetDurationSeconds(settings, 'focus');
  const progressPercent = activeSession ? Math.min(100, Math.max(0, ((activeSession.durationSeconds - remainingSeconds) / activeSession.durationSeconds) * 100)) : 0;

  const finishSession = useCallback(
    (completed = true, interrupted = false) => {
      if (!activeSession) return null;
      const finished: FocusSession = {
        id: activeSession.id,
        taskId: activeSession.taskId,
        taskTitle: activeSession.taskTitle,
        mode: activeSession.mode,
        preset: activeSession.preset,
        durationSeconds: activeSession.durationSeconds,
        startedAt: activeSession.startedAt,
        endedAt: nowIso(),
        completed,
        interrupted,
      };
      setSessions((current) => [finished, ...current]);
      setActiveSession(null);

      if (completed && settings.soundEnabled) playFocusBeep();
      if (completed && settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(activeSession.mode === 'focus' ? 'Sessão concluída' : 'Pausa concluída', { body: 'Hora de respirar e escolher o próximo passo.' });
      }

      if (completed && activeSession.mode === 'focus') {
        const nextCycle = activeSession.currentCycle + 1;
        const nextBreakMode = nextCycle >= getCyclesBeforeLongBreak(settings) ? 'longBreak' : 'shortBreak';
        setCompletionState({ session: finished, nextBreakMode, nextCycle: nextBreakMode === 'longBreak' ? 0 : nextCycle });
        if (settings.autoStartBreak) {
          window.setTimeout(() => {
            const durationSeconds = getPresetDurationSeconds(settings, nextBreakMode);
            setActiveSession({
              id: makeId(),
              mode: nextBreakMode,
              preset: settings.preset,
              durationSeconds,
              startedAt: nowIso(),
              totalPausedSeconds: 0,
              isRunning: true,
              currentCycle: nextBreakMode === 'longBreak' ? 0 : nextCycle,
            });
          }, 0);
        }
      } else if (completed && activeSession.mode !== 'focus') {
        setCompletionState({ session: finished });
        if (settings.autoStartNextFocus) {
          window.setTimeout(() => startFocus(null, activeSession.currentCycle), 0);
        }
      } else {
        setCompletionState(null);
      }
      return finished;
    },
    [activeSession, settings],
  );

  useEffect(() => {
    if (activeSession && remainingSeconds <= 0) finishSession(true, false);
  }, [activeSession, finishSession, remainingSeconds]);

  const startFocus = useCallback(
    (task?: Pick<Task, 'id' | 'title'> | null, cycleOverride?: number) => {
      if (activeSession) return null;
      const session: ActiveFocusSession = {
        id: makeId(),
        taskId: task?.id ?? null,
        taskTitle: task?.title ?? null,
        mode: 'focus',
        preset: settings.preset,
        durationSeconds: getPresetDurationSeconds(settings, 'focus'),
        startedAt: nowIso(),
        totalPausedSeconds: 0,
        isRunning: true,
        currentCycle: cycleOverride ?? 0,
      };
      setCompletionState(null);
      setActiveSession(session);
      return session;
    },
    [activeSession, settings],
  );

  const startBreak = useCallback(
    (mode: 'shortBreak' | 'longBreak' = 'shortBreak') => {
      if (activeSession) return null;
      const nextCycle = mode === 'longBreak' ? 0 : (completionState?.nextCycle ?? 0);
      const session: ActiveFocusSession = {
        id: makeId(),
        mode,
        preset: settings.preset,
        durationSeconds: getPresetDurationSeconds(settings, mode),
        startedAt: nowIso(),
        totalPausedSeconds: 0,
        isRunning: true,
        currentCycle: nextCycle,
      };
      setActiveSession(session);
      setCompletionState(null);
      return session;
    },
    [activeSession, completionState, settings],
  );

  const pause = () => {
    setActiveSession((current) => (current && current.isRunning ? { ...current, isRunning: false, pausedAt: nowIso() } : current));
  };

  const resume = () => {
    setActiveSession((current) => {
      if (!current || current.isRunning) return current;
      const pausedFor = current.pausedAt ? Math.max(0, Math.floor((Date.now() - parseISO(current.pausedAt).getTime()) / 1000)) : 0;
      return { ...current, isRunning: true, pausedAt: null, totalPausedSeconds: current.totalPausedSeconds + pausedFor };
    });
  };

  const reset = () => {
    setActiveSession((current) => (current ? { ...current, startedAt: nowIso(), pausedAt: null, totalPausedSeconds: 0, isRunning: false } : current));
  };

  const interruptSession = () => finishSession(false, true);
  const skipBreak = () => {
    if (activeSession?.mode !== 'focus') finishSession(false, true);
  };

  const updateSettings = (changes: Partial<FocusSettings>) => {
    const next = normalizeSettings({ ...settings, ...changes });
    setSettings(next);
    if (changes.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  };

  const clearHistory = () => setSessions([]);

  const getTodayFocusStats = () => {
    const todaySessions = getTodayFocusSessions(sessions);
    const focusedSeconds = sumFocusSeconds(todaySessions);
    return {
      focusedSeconds,
      completedSessions: todaySessions.length,
      cycles: todaySessions.length,
      goalSeconds: settings.dailyGoalMinutes * 60,
      goalPercent: Math.min(100, Math.round((focusedSeconds / (settings.dailyGoalMinutes * 60)) * 100)),
    };
  };

  const getWeeklyFocusStats = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekSessions = sessions.filter((session) => session.completed && session.mode === 'focus' && parseISO(session.startedAt) >= weekStart);
    return { focusedSeconds: sumFocusSeconds(weekSessions), completedSessions: weekSessions.length };
  };

  const getTaskFocusTotal = (taskId: string) => sumFocusSeconds(sessions.filter((session) => session.taskId === taskId));

  const todayStats = useMemo(getTodayFocusStats, [sessions, settings.dailyGoalMinutes]);

  return {
    activeSession,
    sessions,
    settings,
    remainingSeconds,
    progressPercent,
    selectedPreset,
    completionState,
    todayStats,
    startFocus,
    startBreak,
    pause,
    resume,
    reset,
    finishSession,
    interruptSession,
    skipBreak,
    updateSettings,
    getTodayFocusStats,
    getWeeklyFocusStats,
    getTaskFocusTotal,
    clearHistory,
    isTodaySession: (session: FocusSession) => isSameDay(parseISO(session.startedAt), new Date()),
  };
}
