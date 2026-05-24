import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CupSoda, Leaf, MoreVertical, Plus } from 'lucide-react';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { HangingTag } from '../components/HangingTag';
import { AllHabitsList } from '../components/habits/AllHabitsList';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitModal } from '../components/habits/HabitModal';
import { HabitPresets } from '../components/habits/HabitPresets';
import { HabitSummaryCards } from '../components/habits/HabitSummaryCards';
import { WeekDayPicker } from '../components/habits/WeekDayPicker';
import { WeeklyHabitGrid } from '../components/habits/WeeklyHabitGrid';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { useHabits } from '../hooks/useHabits';
import type { Habit, HabitInput } from '../types/habit';
import { getWeekDateKeys } from '../utils/habits';
import { formatShortDate, todayKey } from '../utils/date';

export function HabitsPage() {
  const habits = useHabits();
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dailyStats = habits.getDailyStats(selectedDate);
  const weeklyStats = habits.getWeeklyStats(selectedDate);
  const weekDays = useMemo(() => getWeekDateKeys(selectedDate), [selectedDate]);
  const expectedHabits = habits.getHabitsForDate(selectedDate);
  const selectedDateLabel = selectedDate === todayKey() ? 'Hoje' : `Hábitos de ${formatShortDate(selectedDate).slice(0, 5)}`;

  const openCreate = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const saveHabit = (input: HabitInput) => {
    if (editingHabit) habits.updateHabit(editingHabit.id, input);
    else habits.createHabit(input);
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const removeHabit = (id: string) => {
    if (window.confirm('Excluir este hábito e seus registros?')) habits.deleteHabit(id);
  };

  const createPreset = (preset: HabitInput) => {
    const exists = habits.habits.some((habit) => habit.title.toLowerCase() === preset.title.toLowerCase());
    if (exists && !window.confirm('Você já tem um hábito com esse nome. Criar mesmo assim?')) return;
    habits.createHabit({ ...preset });
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
                  Hábitos <Leaf className="mb-2 inline text-tea-500" size={31} />
                </h1>
                <p className="mt-3 max-w-2xl text-base text-stone-500">Cultive sua rotina, uma xícara por vez.</p>
              </motion.div>
              <HangingTag />
              <div className="flex items-center gap-3 self-end md:self-start">
                <button type="button" onClick={openCreate} className="inline-flex h-12 items-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800">
                  <Plus size={18} /> Novo hábito
                </button>
                {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
                  <button key={index} type="button" aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'} className="hidden size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card sm:grid">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </header>

            <HabitSummaryCards totalToday={dailyStats.total} completedToday={dailyStats.completed} weeklyPercent={weeklyStats.percent} bestStreak={habits.getBestOverallStreak()} />
            <WeekDayPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            <section className="rounded-[30px] border border-tea-900/10 bg-white/72 p-5 shadow-card">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-tea-900">{selectedDateLabel}</h2>
                  <p className="mt-1 text-sm text-stone-500">Hábitos esperados para a data selecionada.</p>
                </div>
                <p className="rounded-full bg-tea-100 px-4 py-2 text-sm font-bold text-tea-800">{dailyStats.completed}/{dailyStats.total} concluídos</p>
              </div>
              {expectedHabits.length ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {expectedHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      log={habits.getHabitLog(habit.id, selectedDate)}
                      streak={habits.getCurrentStreak(habit.id)}
                      onToggle={() => habits.toggleHabitForDate(habit.id, selectedDate)}
                      onIncrement={() => habits.incrementHabit(habit.id, selectedDate)}
                      onDecrement={() => habits.decrementHabit(habit.id, selectedDate)}
                      onSetValue={(value) => habits.setHabitValue(habit.id, selectedDate, value)}
                      onEdit={() => openEdit(habit)}
                      onToggleActive={() => habits.toggleHabitActive(habit.id)}
                      onDelete={() => removeHabit(habit.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid min-h-52 place-items-center rounded-3xl bg-linen/70 p-8 text-center">
                  <div className="max-w-md">
                    <Leaf className="mx-auto mb-3 text-tea-600" />
                    <h3 className="font-display text-2xl font-semibold text-tea-900">
                      {habits.habits.length ? 'Não há hábitos programados para hoje.' : 'Nenhum hábito ainda. Comece cultivando uma pequena rotina.'}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-500">Aproveite para descansar ou criar um novo ritual.</p>
                    <button type="button" onClick={openCreate} className="mt-5 h-11 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card">
                      Criar hábito
                    </button>
                  </div>
                </div>
              )}
            </section>

            <WeeklyHabitGrid
              habits={habits.habits}
              logs={habits.logs}
              weekDays={weekDays}
              onToggleCell={(habit, dateKey) => habits.toggleHabitForDate(habit.id, dateKey)}
            />

            <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
              <HabitPresets onCreatePreset={createPreset} />
              <AllHabitsList habits={habits.habits} onEdit={openEdit} onToggleActive={habits.toggleHabitActive} onDelete={removeHabit} />
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      <HabitModal isOpen={isModalOpen} habit={editingHabit} onClose={() => setIsModalOpen(false)} onSave={saveHabit} />
    </div>
  );
}
