import { FormEvent, useState } from 'react';
import { CalendarPlus, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task } from '../types/task';
import { todayKey } from '../utils/date';

interface AddTaskBarProps {
  onAddTask: (input: { title: string; dueDate?: string }) => Task | null;
  onOpenDetailedCreate: (initialTitle?: string) => void;
}

export function AddTaskBar({ onAddTask, onOpenDetailedCreate }: AddTaskBarProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Digite um título para criar a tarefa.');
      return;
    }

    onAddTask({ title: trimmed, dueDate: todayKey() });
    setTitle('');
    setError('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-tea-900/10 bg-white/82 p-3 shadow-soft"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tea-600 text-white shadow-card">
          <Plus size={24} />
        </span>
        <label className="sr-only" htmlFor="quick-task-title">
          Título da tarefa
        </label>
        <input
          id="quick-task-title"
          className="min-h-11 flex-1 rounded-xl bg-transparent px-2 text-[15px] text-stone-700 outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-tea-500/35"
          placeholder="O que você quer realizar hoje?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setError('');
          }}
        />

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <motion.button
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-tea-900/10 bg-tea-50/70 px-4 text-sm font-semibold text-tea-700 transition hover:bg-tea-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/35"
            type="button"
            onClick={() => {
              onOpenDetailedCreate(title);
              setTitle('');
              setError('');
            }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <CalendarPlus size={17} />
            Detalhar
          </motion.button>
          <motion.button
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-tea-700 px-8 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tea-500/40"
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Adicionar
            <Sparkles size={15} />
          </motion.button>
        </div>
      </div>
      {error ? <p className="ml-0 mt-2 text-sm font-medium text-rose-600 md:ml-14">{error}</p> : null}
    </motion.form>
  );
}
