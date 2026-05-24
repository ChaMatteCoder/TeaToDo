import { useEffect, useState } from 'react';
import type { PlanningNote } from '../types/planningNote';

const STORAGE_KEY = 'teatodo:planning-notes';
const nowIso = () => new Date().toISOString();
const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const normalizeNote = (value: unknown): PlanningNote | null => {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<PlanningNote>;
  if (typeof item.text !== 'string' || !item.text.trim()) return null;
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : nowIso();
  return {
    id: typeof item.id === 'string' ? item.id : makeId(),
    text: item.text.trim(),
    createdAt,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : createdAt,
  };
};

const readNotes = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeNote).filter((note): note is PlanningNote => Boolean(note));
  } catch {
    return [];
  }
};

export function usePlanningNotes() {
  const [notes, setNotes] = useState<PlanningNote[]>(readNotes);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const timestamp = nowIso();
    setNotes((current) => [{ id: makeId(), text: trimmed, createdAt: timestamp, updatedAt: timestamp }, ...current]);
  };

  const updateNote = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, text: trimmed, updatedAt: nowIso() } : note)));
  };

  const removeNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return { notes, addNote, updateNote, removeNote };
}
