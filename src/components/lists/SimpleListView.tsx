import { FormEvent, useState } from 'react';
import { Calendar, Flag, Plus, Trash2 } from 'lucide-react';
import type { SimpleListItem, SmartList } from '../../types/smartList';
import { getListProgress } from '../../utils/smartLists';

interface SimpleListViewProps {
  list: SmartList;
  onAddItem: (item: Omit<SimpleListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, changes: Partial<SimpleListItem>) => void;
}

export function SimpleListView({ list, onAddItem, onToggleItem, onRemoveItem, onUpdateItem }: SimpleListViewProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<SimpleListItem['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');
  const progress = getListProgress(list);
  const items = list.items.filter((item): item is SimpleListItem => item.type === 'simple').sort((a, b) => Number(a.completed) - Number(b.completed));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Informe um item para adicionar.');
      return;
    }
    onAddItem({ type: 'simple', title: cleanTitle, category: category.trim(), priority, dueDate, note: note.trim() });
    setTitle('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
    setNote('');
    setError('');
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Total', progress.total],
          ['Concluídos', progress.completed],
          ['Pendentes', progress.pending],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-tea-900/10 bg-white/70 p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-tea-600">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-tea-900">{value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-[28px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
        <label className="sr-only" htmlFor="simple-item-title">Novo item</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="simple-item-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10"
            placeholder="Adicionar item simples"
          />
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card">
            <Plus size={18} /> Adicionar
          </button>
        </div>
        <button type="button" onClick={() => setShowMore((value) => !value)} className="mt-3 text-sm font-semibold text-tea-700">
          {showMore ? 'Ocultar opções' : 'Mais opções'}
        </button>
        {showMore ? (
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <input value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Categoria" />
            <select value={priority} onChange={(event) => setPriority(event.target.value as SimpleListItem['priority'])} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none">
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" />
            <input value={note} onChange={(event) => setNote(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Observação" />
          </div>
        ) : null}
        {error ? <p className="mt-2 text-sm font-semibold text-amber-700">{error}</p> : null}
      </form>

      <div className="rounded-[28px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
        {items.length ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-tea-900/10 bg-linen/70 p-3">
                <button type="button" onClick={() => onToggleItem(item.id)} aria-label={item.completed ? 'Marcar como pendente' : 'Marcar como concluído'} className={`grid size-6 shrink-0 place-items-center rounded-full border ${item.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 bg-white'}`}>
                  {item.completed ? '✓' : ''}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    value={item.title}
                    onChange={(event) => onUpdateItem(item.id, { title: event.target.value })}
                    className={`w-full min-w-0 bg-transparent font-semibold outline-none ${item.completed ? 'text-stone-400 line-through' : 'text-tea-900'}`}
                    aria-label="Editar título do item"
                  />
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-stone-500">
                    {item.category ? <span>{item.category}</span> : null}
                    {item.priority ? <span className="inline-flex items-center gap-1"><Flag size={12} /> {item.priority}</span> : null}
                    {item.dueDate ? <span className="inline-flex items-center gap-1"><Calendar size={12} /> {item.dueDate}</span> : null}
                  </div>
                </div>
                <button type="button" onClick={() => onRemoveItem(item.id)} aria-label="Excluir item" className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-40 place-items-center rounded-3xl bg-linen/70 p-8 text-center font-display text-xl font-semibold text-tea-900">
            Nenhum item ainda. Comece com algo simples.
          </div>
        )}
      </div>
    </div>
  );
}
