import { useEffect, useState } from 'react';
import type { ShoppingListItem, SimpleListItem, SmartList, SmartListInput, SmartListItem, StudyListItem } from '../types/smartList';

const STORAGE_KEY = 'teatodo:smart-lists';
const ENABLE_DEMO_SMART_LISTS = false;
const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const demoLists = (): SmartList[] => ENABLE_DEMO_SMART_LISTS ? [] : [];

function normalizeListItem(value: unknown, listType: SmartList['type']): SmartListItem | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<SmartListItem>;
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : nowIso();
  const base = {
    id: typeof item.id === 'string' ? item.id : makeId(),
    completed: Boolean(item.completed),
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
    note: typeof item.note === 'string' ? item.note : undefined,
  };

  if (listType === 'shopping') {
    const candidate = item as Partial<ShoppingListItem>;
    if (typeof candidate.name !== 'string' || !candidate.name.trim()) return null;
    const price = Number(candidate.price ?? 0);
    const quantity = Number(candidate.quantity ?? 1);
    return {
      ...base,
      type: 'shopping',
      name: candidate.name.trim(),
      price: Number.isFinite(price) && price >= 0 ? price : 0,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      unit: candidate.unit,
      category: typeof candidate.category === 'string' ? candidate.category : undefined,
    };
  }

  if (listType === 'study') {
    const candidate = item as Partial<StudyListItem>;
    if (typeof candidate.topic !== 'string' || !candidate.topic.trim()) return null;
    const estimatedMinutes = Number(candidate.estimatedMinutes ?? 0);
    return {
      ...base,
      type: 'study',
      topic: candidate.topic.trim(),
      subject: typeof candidate.subject === 'string' ? candidate.subject : undefined,
      status: candidate.status === 'studying' || candidate.status === 'reviewing' || candidate.status === 'done' ? candidate.status : 'notStarted',
      difficulty: candidate.difficulty,
      estimatedMinutes: Number.isFinite(estimatedMinutes) && estimatedMinutes > 0 ? estimatedMinutes : undefined,
      dueDate: typeof candidate.dueDate === 'string' ? candidate.dueDate : undefined,
    };
  }

  const candidate = item as Partial<SimpleListItem>;
  if (typeof candidate.title !== 'string' || !candidate.title.trim()) return null;
  return {
    ...base,
    type: 'simple',
    title: candidate.title.trim(),
    category: typeof candidate.category === 'string' ? candidate.category : undefined,
    priority: candidate.priority === 'high' || candidate.priority === 'low' ? candidate.priority : 'medium',
    dueDate: typeof candidate.dueDate === 'string' ? candidate.dueDate : undefined,
  };
}

function normalizeList(value: unknown): SmartList | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<SmartList>;
  if (typeof item.title !== 'string' || !item.title.trim()) return null;
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : nowIso();
  const type = item.type === 'shopping' || item.type === 'study' ? item.type : 'simple';
  return {
    id: typeof item.id === 'string' ? item.id : makeId(),
    title: item.title.trim(),
    description: typeof item.description === 'string' ? item.description : '',
    type,
    favorite: Boolean(item.favorite),
    archived: Boolean(item.archived),
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
    items: Array.isArray(item.items)
      ? item.items.map((listItem) => normalizeListItem(listItem, type)).filter((listItem): listItem is SmartListItem => Boolean(listItem))
      : [],
    settings: item.settings ?? {},
  };
}

const readLists = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoLists();
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeList).filter((list): list is SmartList => Boolean(list));
  } catch {
    return [];
  }
};

export function useSmartLists() {
  const [lists, setLists] = useState<SmartList[]>(readLists);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const touchList = (id: string, updater: (list: SmartList) => SmartList) => {
    setLists((current) => current.map((list) => (list.id === id ? { ...updater(list), updatedAt: nowIso() } : list)));
  };

  const createList = (input: SmartListInput) => {
    const title = input.title.trim();
    if (!title) return null;
    const timestamp = nowIso();
    const list: SmartList = {
      id: makeId(),
      title,
      description: input.description?.trim() ?? '',
      type: input.type,
      favorite: false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      items: [],
      settings: input.type === 'shopping' ? { budget: 0, showAdvancedShoppingFields: false, groupByCategory: false } : {},
    };
    setLists((current) => [list, ...current]);
    return list;
  };

  const updateList = (id: string, changes: Partial<Omit<SmartList, 'id' | 'createdAt' | 'items'>>) => {
    touchList(id, (list) => ({ ...list, ...changes }));
  };

  const deleteList = (id: string) => setLists((current) => current.filter((list) => list.id !== id));
  const toggleFavorite = (id: string) => touchList(id, (list) => ({ ...list, favorite: !list.favorite }));
  const toggleArchived = (id: string) => touchList(id, (list) => ({ ...list, archived: !list.archived }));
  const duplicateList = (id: string) => {
    const source = lists.find((list) => list.id === id);
    if (!source) return null;
    const timestamp = nowIso();
    const clone: SmartList = {
      ...source,
      id: makeId(),
      title: `${source.title} cópia`,
      favorite: false,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      items: source.items.map((item) => ({ ...item, id: makeId(), createdAt: timestamp, updatedAt: timestamp })),
    };
    setLists((current) => [clone, ...current]);
    return clone;
  };

  const addItem = (listId: string, item: Omit<SmartListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'> & { completed?: boolean }) => {
    const timestamp = nowIso();
    const next = { ...item, id: makeId(), completed: Boolean(item.completed), createdAt: timestamp, updatedAt: timestamp } as SmartListItem;
    touchList(listId, (list) => ({ ...list, items: [next, ...list.items] }));
  };

  const updateItem = (listId: string, itemId: string, changes: Partial<SimpleListItem | ShoppingListItem | StudyListItem>) => {
    touchList(listId, (list) => ({ ...list, items: list.items.map((item) => (item.id === itemId ? { ...item, ...changes, updatedAt: nowIso() } as SmartListItem : item)) }));
  };

  const removeItem = (listId: string, itemId: string) => {
    touchList(listId, (list) => ({ ...list, items: list.items.filter((item) => item.id !== itemId) }));
  };

  const toggleItem = (listId: string, itemId: string) => {
    touchList(listId, (list) => ({
      ...list,
      items: list.items.map((item) => {
        if (item.id !== itemId) return item;
        const completed = !item.completed;
        if (item.type === 'study') return { ...item, completed, status: completed ? 'done' : 'notStarted', updatedAt: nowIso() };
        return { ...item, completed, updatedAt: nowIso() };
      }),
    }));
  };

  return { lists, createList, updateList, deleteList, toggleFavorite, toggleArchived, duplicateList, addItem, updateItem, removeItem, toggleItem };
}
