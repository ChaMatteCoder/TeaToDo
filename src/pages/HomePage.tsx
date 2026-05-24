import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { AddTaskBar } from '../components/AddTaskBar';
import { DailyQuote } from '../components/DailyQuote';
import { FocusCard } from '../components/FocusCard';
import { HabitsCard } from '../components/HabitsCard';
import { Header } from '../components/Header';
import { MobileNav } from '../components/MobileNav';
import { PriorityCards } from '../components/PriorityCards';
import { ProgressCard } from '../components/ProgressCard';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/TaskModal';
import { TodayTasks } from '../components/TodayTasks';
import { UpcomingTasks } from '../components/UpcomingTasks';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { usePreferences } from '../hooks/usePreferences';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskStatusFilter } from '../types/task';
import { getWeekDays, todayKey } from '../utils/date';

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

function getStatsFromTasks(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const inProgress = total - completed;
  return {
    total,
    completed,
    inProgress,
    productivity: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function HomePage() {
  const {
    tasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    addSubtask,
    toggleSubtask,
    removeSubtask,
    getTasksByDate,
    getStatsForDate,
    upcomingTasks,
  } = useTasks();
  const { preferences } = usePreferences();
  const quote = useDailyQuote(undefined, undefined, preferences.profile.language);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [initialModalTitle, setInitialModalTitle] = useState('');

  const visibleTasks = getTasksByDate(selectedDate, statusFilter);
  const stats = getStatsForDate(selectedDate);
  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) ?? null, [selectedTaskId, tasks]);
  const progressOptions = useMemo(() => {
    const weekDates = new Set(getWeekDays(selectedDate).map((day) => day.dateKey));
    const monthPrefix = selectedDate.slice(0, 7);
    return [
      { label: 'Esta data', stats },
      { label: 'Semana', stats: getStatsFromTasks(tasks.filter((task) => weekDates.has(task.dueDate))) },
      { label: 'Mês', stats: getStatsFromTasks(tasks.filter((task) => task.dueDate.startsWith(monthPrefix))) },
      { label: 'Geral', stats: getStatsFromTasks(tasks) },
    ];
  }, [selectedDate, stats, tasks]);

  const openCreateModal = (initialTitle = '') => {
    setModalMode('create');
    setSelectedTaskId(null);
    setInitialModalTitle(initialTitle);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setModalMode('edit');
    setSelectedTaskId(task.id);
    setInitialModalTitle('');
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setInitialModalTitle('');
  };

  const handleQuickAdd = (input: { title: string; dueDate?: string }) => {
    return addTask({
      title: input.title,
      description: '',
      priority: 'medium',
      category: 'Geral',
      dueDate: input.dueDate || selectedDate,
      dueTime: '',
      subtasks: [],
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,#f3ead8_0,#fffdf7_33%,#fbf8f0_100%)] text-stone-800">
      <div className="pointer-events-none fixed right-[-120px] top-[-110px] h-80 w-80 rounded-full bg-tea-100/60 blur-3xl" />
      <img src={leafAsset} alt="" className="pointer-events-none fixed right-[-70px] top-[16%] hidden w-80 rotate-[-18deg] opacity-[0.055] xl:block" />
      <img src={sprigAsset} alt="" className="pointer-events-none fixed bottom-[-80px] left-[22%] hidden w-72 rotate-12 opacity-[0.05] xl:block" />

      <div className="relative flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-28 pt-7 sm:px-6 lg:px-9 lg:pb-9 xl:px-10">
          <div className="mx-auto max-w-[1280px] space-y-5">
            <Header />
            <AddTaskBar onAddTask={handleQuickAdd} onOpenDetailedCreate={openCreateModal} />

            <div className="grid gap-5 xl:grid-cols-12">
              <TodayTasks
                tasks={visibleTasks}
                selectedDate={selectedDate}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onToggleTask={toggleTask}
                onRemoveTask={removeTask}
                onOpenTask={openEditModal}
                onOpenNewTask={() => openCreateModal()}
              />
              <div className="grid gap-5 xl:col-span-5">
                <PriorityCards counts={stats.byPriority} />
                <UpcomingTasks tasks={upcomingTasks} onOpenTask={openEditModal} />
              </div>
            </div>

            <motion.div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.35fr_0.95fr_1.2fr_1.2fr]" {...cardMotion} transition={{ duration: 0.42, delay: 0.16 }}>
              <WeeklyCalendar tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <FocusCard />
              <HabitsCard />
              <ProgressCard options={progressOptions} />
            </motion.div>

            <DailyQuote quote={quote} />
          </div>
        </main>
      </div>
      <MobileNav />
      <TaskModal
        mode={modalMode}
        task={selectedTask}
        initialTitle={initialModalTitle}
        selectedDate={selectedDate}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onCreate={addTask}
        onUpdate={updateTask}
        onDelete={removeTask}
        onToggleTask={toggleTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onRemoveSubtask={removeSubtask}
      />
    </div>
  );
}
