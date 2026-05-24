export type TaskPriority = 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: string;
  dueDate: string;
  dueTime: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  subtasks: Subtask[];
  notes?: string;
}

export type TaskInput = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  subtasks?: Subtask[];
  notes?: string;
};

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
