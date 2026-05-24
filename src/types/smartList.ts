export type SmartListType = 'simple' | 'shopping' | 'study';

export type SmartListSettings = {
  budget?: number;
  showAdvancedShoppingFields?: boolean;
  groupByCategory?: boolean;
};

export type BaseSmartListItem = {
  id: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  note?: string;
};

export type SimpleListItem = BaseSmartListItem & {
  type: 'simple';
  title: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
};

export type ShoppingListItem = BaseSmartListItem & {
  type: 'shopping';
  name: string;
  price: number;
  quantity?: number;
  unit?: 'un' | 'kg' | 'g' | 'L' | 'ml' | 'pacote' | 'caixa' | 'outro';
  category?: string;
};

export type StudyListItem = BaseSmartListItem & {
  type: 'study';
  topic: string;
  subject?: string;
  status: 'notStarted' | 'studying' | 'reviewing' | 'done';
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedMinutes?: number;
  dueDate?: string;
};

export type SmartListItem = SimpleListItem | ShoppingListItem | StudyListItem;

export type SmartList = {
  id: string;
  title: string;
  description?: string;
  type: SmartListType;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  items: SmartListItem[];
  settings?: SmartListSettings;
};

export type SmartListInput = {
  title: string;
  description?: string;
  type: SmartListType;
};
