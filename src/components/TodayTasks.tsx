import { AnimatePresence, motion } from 'framer-motion';
import { Check, Leaf, SlidersHorizontal } from 'lucide-react';
import type { Task, TaskStatusFilter } from '../types/task';
import { getTaskListTitle } from '../utils/date';
import { TaskItem } from './TaskItem';

interface TodayTasksProps {
  tasks: Task[];
  selectedDate: string;
  statusFilter: TaskStatusFilter;
  onStatusFilterChange: (filter: TaskStatusFilter) => void;
  onToggleTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onOpenTask: (task: Task) => void;
  onOpenNewTask: () => void;
}

const filters: Array<{ value: TaskStatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
];

function getEmptyMessage(filter: TaskStatusFilter) {
  if (filter === 'completed') return 'Você ainda não concluiu tarefas nesta data.';
  if (filter === 'pending') return 'Tudo em dia por aqui.';
  return 'Nenhuma tarefa ativa por aqui. Prepare seu chá e comece com calma.';
}

export function TodayTasks({
  tasks,
  selectedDate,
  statusFilter,
  onStatusFilterChange,
  onToggleTask,
  onRemoveTask,
  onOpenTask,
  onOpenNewTask,
}: TodayTasksProps) {
  const title = getTaskListTitle(selectedDate);

  return (
    <section className="rounded-[22px] border border-tea-900/10 bg-white/82 p-5 shadow-card xl:col-span-7">
      <div className="mb-4 flex flex-col gap-4 border-b border-tea-900/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-2xl font-semibold text-tea-950">{title}</h3>
          <span className="rounded-full bg-tea-100 px-2.5 py-1 text-xs font-bold text-tea-700">{tasks.length}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 px-1 text-sm text-stone-500">
            <SlidersHorizontal size={16} />
            Filtrar
          </span>
          {filters.map((filter) => (
            <motion.button
              key={filter.value}
              type="button"
              onClick={() => onStatusFilterChange(filter.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35 ${
                statusFilter === filter.value ? 'bg-tea-700 text-white shadow-card' : 'bg-tea-50 text-stone-600 hover:bg-tea-100'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="min-h-[318px] space-y-1">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} onOpenTask={onOpenTask} />
          ))}
        </AnimatePresence>

        {!tasks.length ? (
          <motion.div className="grid min-h-[260px] place-items-center rounded-3xl bg-tea-50/55 px-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div>
              <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-white text-tea-600 shadow-card">
                <Leaf size={22} />
              </span>
              <p className="mx-auto max-w-sm font-display text-xl leading-7 text-tea-900">{getEmptyMessage(statusFilter)}</p>
            </div>
          </motion.div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpenNewTask}
        className="mt-4 flex items-center gap-3 border-t border-tea-900/10 pt-4 text-sm font-medium text-tea-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/25"
      >
        <span className="grid size-6 place-items-center rounded-full bg-tea-600 text-white">
          <Check size={14} />
        </span>
        + Adicionar tarefa detalhada
      </button>
    </section>
  );
}
