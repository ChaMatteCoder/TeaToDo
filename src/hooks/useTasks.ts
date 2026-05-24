import { useEffect, useMemo, useState } from 'react';
import type { Subtask, Task, TaskInput, TaskPriority, TaskStatusFilter } from '../types/task';
import { sortByDateTime, todayKey } from '../utils/date';

const STORAGE_KEY = 'teatodo:tasks';
const LEGACY_STORAGE_KEY = 'teatodo.tasks.v1';
const ENABLE_DEMO_TASKS = false;

const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const priorityMap: Record<string, TaskPriority> = {
  alta: 'high',
  media: 'medium',
  média: 'medium',
  baixa: 'low',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

const createSubtask = (title: string): Subtask => ({
  id: makeId(),
  title: title.trim(),
  completed: false,
  createdAt: nowIso(),
});

const demoTasks = (): Task[] => {
  const today = todayKey();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));

  return [
    {
      id: 'demo-1',
      title: 'Organizar prioridades do TeaToDo',
      description: 'Revisar o que precisa entrar hoje e separar o restante para a semana.',
      completed: false,
      priority: 'high',
      category: 'Trabalho',
      dueDate: today,
      dueTime: '09:00',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      completedAt: null,
      subtasks: [createSubtask('Separar tarefas essenciais'), createSubtask('Definir blocos de foco')],
    },
    {
      id: 'demo-2',
      title: 'Preparar pausa para o chá',
      description: 'Uma pausa curta antes do próximo bloco de trabalho.',
      completed: true,
      priority: 'low',
      category: 'Bem-estar',
      dueDate: today,
      dueTime: '16:00',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      completedAt: nowIso(),
      subtasks: [],
    },
    {
      id: 'demo-3',
      title: 'Planejar compras da casa',
      description: '',
      completed: false,
      priority: 'medium',
      category: 'Casa',
      dueDate: toDateKey(tomorrow),
      dueTime: '10:30',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      completedAt: null,
      subtasks: [],
    },
    {
      id: 'demo-4',
      title: 'Revisar metas da semana',
      description: '',
      completed: false,
      priority: 'medium',
      category: 'Pessoal',
      dueDate: toDateKey(nextFriday),
      dueTime: '14:00',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      completedAt: null,
      subtasks: [],
    },
  ];
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const normalizeTask = (value: unknown): Task | null => {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<Task> & {
    date?: string;
    time?: string;
    priority?: string;
  };

  if (typeof item.title !== 'string' || !item.title.trim()) return null;
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : nowIso();
  const completed = Boolean(item.completed);

  return {
    id: typeof item.id === 'string' ? item.id : makeId(),
    title: item.title.trim(),
    description: typeof item.description === 'string' ? item.description : '',
    completed,
    priority: priorityMap[item.priority ?? ''] ?? 'medium',
    category: typeof item.category === 'string' && item.category.trim() ? item.category.trim() : 'Geral',
    dueDate: typeof item.dueDate === 'string' ? item.dueDate : typeof item.date === 'string' ? item.date : todayKey(),
    dueTime: typeof item.dueTime === 'string' ? item.dueTime : typeof item.time === 'string' ? item.time : '',
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
    completedAt: completed ? (typeof item.completedAt === 'string' ? item.completedAt : nowIso()) : null,
    subtasks: Array.isArray(item.subtasks)
      ? item.subtasks
          .map((subtask) => {
            if (!subtask || typeof subtask !== 'object') return null;
            const candidate = subtask as Partial<Subtask>;
            if (typeof candidate.title !== 'string' || !candidate.title.trim()) return null;
            return {
              id: typeof candidate.id === 'string' ? candidate.id : makeId(),
              title: candidate.title.trim(),
              completed: Boolean(candidate.completed),
              createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : nowIso(),
            };
          })
          .filter((subtask): subtask is Subtask => Boolean(subtask))
      : [],
    notes: typeof item.notes === 'string' ? item.notes : undefined,
  };
};

const readStoredTasks = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!stored) return ENABLE_DEMO_TASKS ? demoTasks() : [];

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return ENABLE_DEMO_TASKS ? demoTasks() : [];
    return parsed.map(normalizeTask).filter((task): task is Task => Boolean(task));
  } catch {
    return ENABLE_DEMO_TASKS ? demoTasks() : [];
  }
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(readStoredTasks);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (input: TaskInput) => {
    const title = input.title.trim().replace(/\s+/g, ' ');
    if (!title) return null;

    const timestamp = nowIso();
    const task: Task = {
      id: makeId(),
      title,
      description: input.description?.trim() ?? '',
      completed: false,
      priority: input.priority ?? 'medium',
      category: input.category?.trim() || 'Geral',
      dueDate: input.dueDate || todayKey(),
      dueTime: input.dueTime || '',
      createdAt: timestamp,
      updatedAt: timestamp,
      completedAt: null,
      subtasks: input.subtasks ?? [],
      notes: input.notes,
    };

    setTasks((current) => [task, ...current]);
    return task;
  };

  const updateTask = (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    let updatedTask: Task | null = null;
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;
        updatedTask = {
          ...task,
          ...changes,
          title: typeof changes.title === 'string' ? changes.title.trim().replace(/\s+/g, ' ') : task.title,
          category: typeof changes.category === 'string' ? changes.category.trim() || 'Geral' : task.category,
          updatedAt: nowIso(),
        };
        return updatedTask;
      }),
    );
    return updatedTask;
  };

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? null : nowIso(),
              updatedAt: nowIso(),
            }
          : task,
      ),
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    const trimmed = title.trim().replace(/\s+/g, ' ');
    if (!trimmed) return;
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [...task.subtasks, createSubtask(trimmed)],
              updatedAt: nowIso(),
            }
          : task,
      ),
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask)),
              updatedAt: nowIso(),
            }
          : task,
      ),
    );
  };

  const removeSubtask = (taskId: string, subtaskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
              updatedAt: nowIso(),
            }
          : task,
      ),
    );
  };

  const clearCompleted = (date?: string) => {
    setTasks((current) => current.filter((task) => !task.completed || (date ? task.dueDate !== date : false)));
  };

  const getTasksByDate = (date: string, status: TaskStatusFilter = 'all') => {
    return sortByDateTime(
      tasks.filter((task) => {
        if (task.dueDate !== date) return false;
        if (status === 'pending') return !task.completed;
        if (status === 'completed') return task.completed;
        return !task.completed;
      }),
    );
  };

  const getTasksByPriority = (priority: TaskPriority, date?: string) => {
    return tasks.filter((task) => task.priority === priority && (!date || task.dueDate === date));
  };

  const getTasksByStatus = (completed: boolean, date?: string) => {
    return tasks.filter((task) => task.completed === completed && (!date || task.dueDate === date));
  };

  const getStatsForDate = (date: string) => {
    const tasksForDate = tasks.filter((task) => task.dueDate === date);
    const total = tasksForDate.length;
    const completed = tasksForDate.filter((task) => task.completed).length;
    const inProgress = total - completed;
    const productivity = total ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      productivity,
      // Conta todas as tarefas do dia, concluídas e pendentes, para refletir a carga planejada.
      byPriority: {
        high: tasksForDate.filter((task) => task.priority === 'high').length,
        medium: tasksForDate.filter((task) => task.priority === 'medium').length,
        low: tasksForDate.filter((task) => task.priority === 'low').length,
      },
    };
  };

  const upcomingTasks = useMemo(() => {
    const today = todayKey();
    return sortByDateTime(tasks.filter((task) => !task.completed && task.dueDate > today)).slice(0, 5);
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    addSubtask,
    toggleSubtask,
    removeSubtask,
    clearCompleted,
    getTasksByDate,
    getTasksByPriority,
    getTasksByStatus,
    getStatsForDate,
    upcomingTasks,
  };
}
