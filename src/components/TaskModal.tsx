import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Flag, Plus, Save, Trash2, X } from 'lucide-react';
import type { Subtask, Task, TaskInput, TaskPriority } from '../types/task';
import { todayKey } from '../utils/date';

interface TaskModalProps {
  mode: 'create' | 'edit';
  task?: Task | null;
  initialTitle?: string;
  selectedDate: string;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: TaskInput) => Task | null;
  onUpdate: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => Task | null;
  onDelete: (id: string) => void;
  onToggleTask: (id: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRemoveSubtask: (taskId: string, subtaskId: string) => void;
}

const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const emptyDraft = (selectedDate: string, initialTitle = ''): TaskInput => ({
  title: initialTitle,
  description: '',
  priority: 'medium',
  category: 'Geral',
  dueDate: selectedDate || todayKey(),
  dueTime: '',
  subtasks: [],
});

export function TaskModal({
  mode,
  task,
  initialTitle,
  selectedDate,
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onToggleTask,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
}: TaskModalProps) {
  const [draft, setDraft] = useState<TaskInput>(() => emptyDraft(selectedDate));
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && task) {
      setDraft({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        subtasks: task.subtasks,
        notes: task.notes,
      });
    } else {
      setDraft(emptyDraft(selectedDate, initialTitle?.trim() ?? ''));
    }
    setSubtaskTitle('');
    setError('');
  }, [initialTitle, isOpen, mode, selectedDate, task]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const liveSubtasks = task?.subtasks ?? draft.subtasks ?? [];
  const modalTitle = mode === 'create' ? 'Nova tarefa' : 'Detalhes da tarefa';

  const completedSubtasks = useMemo(() => liveSubtasks.filter((subtask) => subtask.completed).length, [liveSubtasks]);

  const updateDraft = (changes: Partial<TaskInput>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setError('');
  };

  const handleSubtaskSubmit = () => {
    const trimmed = subtaskTitle.trim();
    if (!trimmed) return;

    if (mode === 'edit' && task) {
      onAddSubtask(task.id, trimmed);
    } else {
      const nextSubtask: Subtask = {
        id: makeId(),
        title: trimmed,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      updateDraft({ subtasks: [...(draft.subtasks ?? []), nextSubtask] });
    }
    setSubtaskTitle('');
  };

  const handleSubtaskKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubtaskSubmit();
    }
  };

  const toggleDraftSubtask = (id: string) => {
    updateDraft({
      subtasks: (draft.subtasks ?? []).map((subtask) => (subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask)),
    });
  };

  const removeDraftSubtask = (id: string) => {
    updateDraft({ subtasks: (draft.subtasks ?? []).filter((subtask) => subtask.id !== id) });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = draft.title.trim().replace(/\s+/g, ' ');
    if (!title) {
      setError('O título é obrigatório.');
      return;
    }

    const payload = {
      ...draft,
      title,
      description: draft.description?.trim() ?? '',
      category: draft.category?.trim() || 'Geral',
      dueDate: draft.dueDate || todayKey(),
      dueTime: draft.dueTime ?? '',
    };

    if (mode === 'edit' && task) {
      onUpdate(task.id, payload);
    } else {
      onCreate(payload);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end bg-tea-950/45 p-3 backdrop-blur-md sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="teatodo-scrollbar max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-tea-900/15 bg-linen p-5 shadow-[0_30px_110px_rgba(34,43,28,0.36)] ring-1 ring-white/70 sm:p-7"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(event) => event.stopPropagation()}
            aria-modal="true"
            role="dialog"
            aria-labelledby="task-modal-title"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea-600">{mode === 'create' ? 'Planejar com calma' : 'Editar e acompanhar'}</p>
                <h2 id="task-modal-title" className="mt-1 font-display text-3xl font-semibold text-tea-950">
                  {modalTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar modal"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-tea-900/10 bg-white/70 text-stone-500 transition hover:bg-tea-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35"
              >
                <X size={19} />
              </button>
            </div>

            {mode === 'edit' && task ? (
              <section className="mb-5 rounded-3xl border border-tea-900/10 bg-gradient-to-br from-white/78 to-tea-50/70 p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-tea-100 px-3 py-1 text-xs font-bold text-tea-700">{task.category}</span>
                  {task.dueTime ? <span className="text-xs font-semibold text-stone-500">{task.dueTime}</span> : null}
                  {task.completed ? <span className="rounded-full bg-tea-700 px-3 py-1 text-xs font-bold text-white">Concluída</span> : null}
                </div>
                <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-tea-950">{task.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-600">
                  {task.description || 'Sem descrição adicionada.'}
                </p>
                <div className="mt-4 rounded-2xl bg-white/62 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-tea-900">Subtarefas</p>
                    <span className="text-xs font-semibold text-stone-500">
                      {completedSubtasks}/{liveSubtasks.length}
                    </span>
                  </div>
                  {liveSubtasks.length ? (
                    <div className="space-y-2">
                      {liveSubtasks.map((subtask) => (
                        <div className="flex items-center gap-2 text-sm text-stone-600" key={subtask.id}>
                          <span className={`grid size-5 place-items-center rounded-full border ${subtask.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300'}`}>
                            {subtask.completed ? <Check size={12} /> : null}
                          </span>
                          <span className={subtask.completed ? 'line-through opacity-60' : ''}>{subtask.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-500">Nenhuma subtarefa cadastrada.</p>
                  )}
                </div>
              </section>
            ) : null}

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Título</span>
                <input
                  className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none transition focus:border-tea-500/50 focus-visible:ring-2 focus-visible:ring-tea-500/25"
                  value={draft.title}
                  onChange={(event) => updateDraft({ title: event.target.value })}
                  autoFocus
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-700">Descrição</span>
                <textarea
                  className="min-h-28 resize-y rounded-2xl border border-tea-900/10 bg-white/78 px-4 py-3 outline-none transition focus:border-tea-500/50 focus-visible:ring-2 focus-visible:ring-tea-500/25"
                  value={draft.description}
                  onChange={(event) => updateDraft({ description: event.target.value })}
                  placeholder="Detalhes, contexto ou intenção para essa tarefa."
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                    <Flag size={16} /> Prioridade
                  </span>
                  <select
                    className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    value={draft.priority}
                    onChange={(event) => updateDraft({ priority: event.target.value as TaskPriority })}
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-700">Categoria</span>
                  <input
                    className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    value={draft.category}
                    onChange={(event) => updateDraft({ category: event.target.value })}
                    list="task-categories"
                  />
                  <datalist id="task-categories">
                    <option value="Geral" />
                    <option value="Trabalho" />
                    <option value="Pessoal" />
                    <option value="Casa" />
                    <option value="Bem-estar" />
                  </datalist>
                </label>

                <label className="grid gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                    <Calendar size={16} /> Data
                  </span>
                  <input
                    className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    type="date"
                    value={draft.dueDate}
                    onChange={(event) => updateDraft({ dueDate: event.target.value })}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-700">Horário</span>
                  <input
                    className="h-12 rounded-2xl border border-tea-900/10 bg-white/78 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    type="time"
                    value={draft.dueTime}
                    onChange={(event) => updateDraft({ dueTime: event.target.value })}
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-tea-900/10 bg-white/62 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-tea-950">Subtarefas</h3>
                  <span className="text-sm text-stone-500">
                    {completedSubtasks}/{liveSubtasks.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="subtask-title">
                    Nova subtarefa
                  </label>
                  <input
                    id="subtask-title"
                    className="h-11 min-w-0 flex-1 rounded-2xl border border-tea-900/10 bg-white/80 px-4 outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    value={subtaskTitle}
                    onChange={(event) => setSubtaskTitle(event.target.value)}
                    onKeyDown={handleSubtaskKeyDown}
                    placeholder="Adicionar subtarefa"
                  />
                  <button
                    type="button"
                    onClick={handleSubtaskSubmit}
                    aria-label="Adicionar subtarefa"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-tea-700 text-white transition hover:bg-tea-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {liveSubtasks.map((subtask) => (
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-tea-50/70 px-3 py-2" key={subtask.id}>
                      <button
                        type="button"
                        aria-label={subtask.completed ? 'Desconcluir subtarefa' : 'Concluir subtarefa'}
                        onClick={() => {
                          if (mode === 'edit' && task) onToggleSubtask(task.id, subtask.id);
                          else toggleDraftSubtask(subtask.id);
                        }}
                        className={`grid size-6 place-items-center rounded-full border ${
                          subtask.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </button>
                      <span className={`text-sm ${subtask.completed ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{subtask.title}</span>
                      <button
                        type="button"
                        aria-label="Excluir subtarefa"
                        onClick={() => {
                          if (mode === 'edit' && task) onRemoveSubtask(task.id, subtask.id);
                          else removeDraftSubtask(subtask.id);
                        }}
                        className="grid size-8 place-items-center rounded-full text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {!liveSubtasks.length ? <p className="rounded-2xl bg-tea-50/70 px-4 py-3 text-sm text-stone-500">Nenhuma subtarefa ainda.</p> : null}
                </div>
              </div>
            </div>

            {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                {mode === 'edit' && task ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="rounded-full border border-tea-900/10 bg-white/70 px-4 py-3 text-sm font-semibold text-tea-700 transition hover:bg-tea-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
                    >
                      {task.completed ? 'Desconcluir' : 'Concluir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(task.id);
                        onClose();
                      }}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                    >
                      Excluir
                    </button>
                  </>
                ) : null}
              </div>
              <motion.button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-tea-700 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={17} />
                Salvar tarefa
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
