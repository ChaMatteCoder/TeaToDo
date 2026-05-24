import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CupSoda, Leaf, MoreVertical } from 'lucide-react';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { DailyQuote } from '../components/DailyQuote';
import { HangingTag } from '../components/HangingTag';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/TaskModal';
import { DayAgenda } from '../components/calendar/DayAgenda';
import { ImportantDeadlines } from '../components/calendar/ImportantDeadlines';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { NextSevenDays } from '../components/calendar/NextSevenDays';
import { PlanningNotesCard } from '../components/calendar/PlanningNotesCard';
import { PlanningNotesModal } from '../components/calendar/PlanningNotesModal';
import { RecurringRoutinesCard } from '../components/calendar/RecurringRoutinesCard';
import { RoutineModal } from '../components/calendar/RoutineModal';
import { useDailyQuote } from '../hooks/useDailyQuote';
import { usePlanningNotes } from '../hooks/usePlanningNotes';
import { usePreferences } from '../hooks/usePreferences';
import { generateTasksFromRoutines, useRoutines } from '../hooks/useRoutines';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';
import { formatDateKey, parseDate, todayKey } from '../utils/date';

export function CalendarPage() {
  const {
    tasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    addSubtask,
    toggleSubtask,
    removeSubtask,
  } = useTasks();
  const { routines, saveRoutine, removeRoutine } = useRoutines();
  const { notes, addNote, updateNote, removeNote } = usePlanningNotes();
  const { preferences } = usePreferences();
  const quote = useDailyQuote('A constância é como o chá: leve, diária e transforma.', 'teatodo:calendar-quote', preferences.profile.language);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [monthDate, setMonthDate] = useState(new Date());
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const selectedDateObject = useMemo(() => parseDate(selectedDate), [selectedDate]);
  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) ?? null, [selectedTaskId, tasks]);
  const dayTasks = useMemo(() => tasks.filter((task) => task.dueDate === selectedDate), [selectedDate, tasks]);

  useEffect(() => {
    const routineTasks = generateTasksFromRoutines(routines, selectedDateObject);
    const taskKey = (title: string, dueDate = '', dueTime = '', category = 'Rotina') =>
      `${dueDate}|${dueTime}|${category}|${title.trim().toLowerCase()}`;
    const existingKeys = new Set(tasks.map((task) => taskKey(task.title, task.dueDate, task.dueTime, task.category)));

    routineTasks.forEach((routineTask) => {
      const key = taskKey(routineTask.title, routineTask.dueDate, routineTask.dueTime, routineTask.category);
      if (existingKeys.has(key)) return;
      existingKeys.add(key);
      addTask(routineTask);
    });
  }, [addTask, routines, selectedDateObject, tasks]);

  const openCreateTask = () => {
    setModalMode('create');
    setSelectedTaskId(null);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setModalMode('edit');
    setSelectedTaskId(task.id);
    setIsTaskModalOpen(true);
  };

  const handleSelectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setMonthDate(parseDate(dateKey));
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
            <header className="relative flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <h1 className="font-display text-4xl font-semibold leading-tight text-tea-900 sm:text-5xl">
                  Calendário <Leaf className="mb-2 inline text-tea-500" size={31} />
                </h1>
                <p className="mt-3 text-base text-stone-500">Planeje seus dias. Cultive consistência.</p>
              </motion.div>
              <HangingTag />
              <div className="flex items-center gap-3 self-end md:self-start">
                {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
                  <button key={index} type="button" aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'} className="grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </header>

            <div className="grid gap-5 xl:grid-cols-12">
              <MonthCalendar monthDate={monthDate} selectedDate={selectedDate} tasks={tasks} onMonthChange={setMonthDate} onSelectDate={handleSelectDate} />
              <DayAgenda selectedDate={selectedDateObject} tasks={dayTasks} onToggleTask={toggleTask} onOpenTask={openEditTask} onAddTask={openCreateTask} />
            </div>

            <NextSevenDays selectedDate={selectedDateObject} tasks={tasks} onSelectDate={handleSelectDate} />

            <div className="grid gap-5 xl:grid-cols-3">
              <RecurringRoutinesCard routines={routines} onEdit={() => setIsRoutineModalOpen(true)} />
              <ImportantDeadlines tasks={tasks} onOpenTask={openEditTask} />
              <PlanningNotesCard notes={notes} onEdit={() => setIsNotesModalOpen(true)} />
            </div>

            <DailyQuote quote={quote || 'A constância é como o chá: leve, diária e transforma.'} />
          </div>
        </main>
      </div>

      <MobileNav />
      <TaskModal
        mode={modalMode}
        task={selectedTask}
        selectedDate={formatDateKey(selectedDateObject)}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={addTask}
        onUpdate={updateTask}
        onDelete={removeTask}
        onToggleTask={toggleTask}
        onAddSubtask={addSubtask}
        onToggleSubtask={toggleSubtask}
        onRemoveSubtask={removeSubtask}
      />
      <RoutineModal isOpen={isRoutineModalOpen} routines={routines} onClose={() => setIsRoutineModalOpen(false)} onSave={saveRoutine} onRemove={removeRoutine} />
      <PlanningNotesModal isOpen={isNotesModalOpen} notes={notes} onClose={() => setIsNotesModalOpen(false)} onAdd={addNote} onUpdate={updateNote} onRemove={removeNote} />
    </div>
  );
}
