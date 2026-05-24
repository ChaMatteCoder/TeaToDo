import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CupSoda, Leaf, MoreVertical } from 'lucide-react';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { HangingTag } from '../components/HangingTag';
import { FocusCompletedPanel } from '../components/focus/FocusCompletedPanel';
import { FocusHistoryCard } from '../components/focus/FocusHistoryCard';
import { InterruptFocusModal } from '../components/focus/InterruptFocusModal';
import { FocusPresetSelector } from '../components/focus/FocusPresetSelector';
import { FocusSettingsCard } from '../components/focus/FocusSettingsCard';
import { FocusStatsCard } from '../components/focus/FocusStatsCard';
import { FocusTaskSelector } from '../components/focus/FocusTaskSelector';
import { FocusTimerCard } from '../components/focus/FocusTimerCard';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { TaskModal } from '../components/TaskModal';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';
import { getCyclesBeforeLongBreak } from '../utils/focus';
import { todayKey } from '../utils/date';

export function FocusPage() {
  const focus = useFocusTimer();
  const { tasks, updateTask, removeTask, toggleTask, addTask, addSubtask, toggleSubtask, removeSubtask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedTaskModalId, setSelectedTaskModalId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInterruptModalOpen, setIsInterruptModalOpen] = useState(false);

  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) ?? null, [selectedTaskId, tasks]);
  const modalTask = useMemo(() => tasks.find((task) => task.id === selectedTaskModalId) ?? null, [selectedTaskModalId, tasks]);
  const linkedTask = focus.activeSession?.taskId ? tasks.find((task) => task.id === focus.activeSession?.taskId) ?? null : null;

  const openTask = (task: Task) => {
    setSelectedTaskModalId(task.id);
    setIsTaskModalOpen(true);
  };

  const completeTask = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (task && !task.completed) toggleTask(id);
  };

  const confirmFinish = () => {
    if (!focus.activeSession) return;
    if (focus.remainingSeconds > 0) {
      setIsInterruptModalOpen(true);
      return;
    }
    focus.finishSession(true, false);
  };

  const confirmReset = () => {
    if (focus.activeSession?.isRunning && !window.confirm('Reiniciar o timer atual?')) return;
    focus.reset();
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
                  Foco <Leaf className="mb-2 inline text-tea-500" size={31} />
                </h1>
                <p className="mt-3 text-base text-stone-500">Prepare seu chá. Escolha uma tarefa. Comece com calma.</p>
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

            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,7fr)_minmax(320px,5fr)]">
              <div className="grid gap-5">
                <FocusTimerCard
                  activeSession={focus.activeSession}
                  remainingSeconds={focus.remainingSeconds}
                  progressPercent={focus.progressPercent}
                  selectedPreset={focus.selectedPreset}
                  cyclesBeforeLongBreak={getCyclesBeforeLongBreak(focus.settings)}
                  onStart={() => focus.startFocus(selectedTask)}
                  onPause={focus.pause}
                  onResume={focus.resume}
                  onFinish={confirmFinish}
                  onReset={confirmReset}
                  onSkipBreak={focus.skipBreak}
                />
                <FocusStatsCard {...focus.todayStats} />
                <FocusHistoryCard sessions={focus.sessions} onClear={() => window.confirm('Limpar histórico de foco?') && focus.clearHistory()} />
              </div>
              <div className="grid min-w-0 gap-5">
                <FocusPresetSelector settings={focus.settings} hasActiveSession={Boolean(focus.activeSession)} onChange={(preset) => focus.updateSettings({ preset })} />
                <FocusTaskSelector tasks={tasks} selectedTaskId={selectedTaskId} activeSession={focus.activeSession} onSelectTask={setSelectedTaskId} onOpenTask={openTask} onCompleteTask={completeTask} />
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-12">
              <FocusCompletedPanel
                completionState={focus.completionState}
                hasLinkedTask={Boolean(linkedTask)}
                onStartBreak={() => focus.startBreak(focus.completionState?.nextBreakMode ?? 'shortBreak')}
                onStartFocus={() => focus.startFocus(selectedTask)}
                onCompleteTask={() => linkedTask && completeTask(linkedTask.id)}
              />
              <div className="xl:col-span-12">
                <FocusSettingsCard settings={focus.settings} onUpdate={focus.updateSettings} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      <TaskModal
        mode="edit"
        task={modalTask}
        selectedDate={modalTask?.dueDate ?? todayKey()}
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
      <InterruptFocusModal
        isOpen={isInterruptModalOpen}
        onCancel={() => setIsInterruptModalOpen(false)}
        onConfirm={() => {
          focus.interruptSession();
          setIsInterruptModalOpen(false);
        }}
      />
    </div>
  );
}
