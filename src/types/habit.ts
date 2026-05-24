export type HabitType = 'check' | 'quantity';

export type HabitFrequencyType = 'daily' | 'weekdays' | 'specificDays';

export type HabitCategory = 'health' | 'mind' | 'study' | 'organization' | 'custom';

export type HabitFrequency = {
  type: HabitFrequencyType;
  // Uses Date.getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday.
  daysOfWeek?: number[];
};

export type HabitTarget = {
  type: HabitType;
  value: number;
  unit?: string;
};

export type Habit = {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  icon?: string;
  frequency: HabitFrequency;
  target: HabitTarget;
  reminderTime?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string;
  value: number;
  completed: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type HabitInput = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;
