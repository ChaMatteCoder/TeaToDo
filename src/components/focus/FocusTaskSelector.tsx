import { Check, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ActiveFocusSession } from '../../types/focus';
import type { Task } from '../../types/task';
import { todayKey } from '../../utils/date';

interface FocusTaskSelectorProps {
  tasks: Task[];
  selectedTaskId: string;
  activeSession: ActiveFocusSession | null;
  onSelectTask: (id: string) => void;
  onOpenTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
}

export function FocusTaskSelector({ tasks, selectedTaskId, activeSession, onSelectTask, onOpenTask, onCompleteTask }: FocusTaskSelectorProps) {
  const pendingTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const today = todayKey();
      const aToday = a.dueDate === today ? 0 : 1;
      const bToday = b.dueDate === today ? 0 : 1;
      return aToday - bToday || `${a.dueDate} ${a.dueTime || '99:99'}`.localeCompare(`${b.dueDate} ${b.dueTime || '99:99'}`);
    });
  const linkedTask = activeSession?.taskId ? tasks.find((task) => task.id === activeSession.taskId) : null;

  return (
    <section className="min-w-0 overflow-hidden rounded-[24px] border border-tea-900/10 bg-white/82 p-5 shadow-card">
      <h2 className="font-display text-2xl font-semibold text-tea-950">Tarefa em foco</h2>
      {activeSession ? (
        <div className="mt-4 rounded-3xl bg-tea-50/70 p-4">
          <p className="text-sm text-stone-500">Sessão vinculada</p>
          <p className="mt-1 font-semibold text-stone-800">{activeSession.taskTitle || 'Sem tarefa vinculada'}</p>
          {linkedTask ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => onOpenTask(linkedTask)} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-tea-700">
                <ExternalLink size={15} /> Abrir tarefa
              </button>
              {!linkedTask.completed ? (
                <button type="button" onClick={() => onCompleteTask(linkedTask.id)} className="flex items-center gap-2 rounded-full bg-tea-700 px-4 py-2 text-sm font-semibold text-white">
                  <CheckCircle2 size={15} /> Marcar como concluída
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          <p className="text-sm font-semibold text-stone-700">Escolha antes de iniciar</p>
          <button
            type="button"
            onClick={() => onSelectTask('')}
            className={`grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
              selectedTaskId === '' ? 'border-tea-600 bg-tea-100/75' : 'border-tea-900/10 bg-white/78 hover:bg-tea-50'
            }`}
          >
            <span className={`grid size-6 place-items-center rounded-full border ${selectedTaskId === '' ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 text-transparent'}`}>
              <Check size={14} />
            </span>
            <span className="truncate text-sm font-semibold text-stone-700">Sem tarefa vinculada</span>
          </button>
          <div className="teatodo-scrollbar grid max-h-[220px] gap-2 overflow-y-auto pr-2">
            {pendingTasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  selectedTaskId === task.id ? 'border-tea-600 bg-tea-100/75' : 'border-tea-900/10 bg-white/78 hover:bg-tea-50'
                }`}
              >
                <span className={`grid size-6 place-items-center rounded-full border ${selectedTaskId === task.id ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 text-transparent'}`}>
                  <Check size={14} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-stone-800">{task.title}</span>
                  <span className="block truncate text-xs text-stone-500">{task.dueTime ? `${task.dueTime} • ` : ''}{task.category}</span>
                </span>
                <span className="shrink-0 rounded-full bg-tea-100 px-2.5 py-1 text-[11px] font-bold text-tea-700">{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
