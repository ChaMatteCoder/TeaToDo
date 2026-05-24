import { FormEvent, useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SmartList, StudyListItem } from '../../types/smartList';
import { getStudyTotals } from '../../utils/smartLists';

interface StudyListViewProps {
  list: SmartList;
  onAddItem: (item: Omit<StudyListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, changes: Partial<StudyListItem>) => void;
}

const statusOptions: Array<{ value: StudyListItem['status']; label: string }> = [
  { value: 'notStarted', label: 'Não iniciado' },
  { value: 'studying', label: 'Estudando' },
  { value: 'reviewing', label: 'Revisando' },
  { value: 'done', label: 'Concluído' },
];

export function StudyListView({ list, onAddItem, onRemoveItem, onUpdateItem }: StudyListViewProps) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<StudyListItem['status']>('notStarted');
  const [difficulty, setDifficulty] = useState<StudyListItem['difficulty']>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');
  const items = useMemo(() => list.items.filter((item): item is StudyListItem => item.type === 'study'), [list.items]);
  const totals = getStudyTotals(items);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError('Informe um tópico.');
      return;
    }
    const minutes = estimatedMinutes ? Number(estimatedMinutes) : undefined;
    onAddItem({
      type: 'study',
      topic: cleanTopic,
      subject: subject.trim(),
      status,
      difficulty,
      estimatedMinutes: Number.isFinite(minutes) ? minutes : undefined,
      dueDate,
      note: note.trim(),
    });
    setTopic('');
    setSubject('');
    setStatus('notStarted');
    setDifficulty('medium');
    setEstimatedMinutes('');
    setDueDate('');
    setNote('');
    setError('');
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Tópicos', totals.total],
          ['Concluídos', totals.done],
          ['Em estudo', totals.studying],
          ['Revisão', totals.reviewing],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-tea-900/10 bg-white/70 p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tea-600">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-tea-900">{value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-[28px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className="h-12 min-w-0 flex-1 rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" placeholder="Tópico de estudo" aria-label="Tópico de estudo" />
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card">
            <Plus size={18} /> Adicionar
          </button>
        </div>
        <button type="button" onClick={() => setShowMore((value) => !value)} className="mt-3 text-sm font-semibold text-tea-700">
          {showMore ? 'Ocultar opções' : 'Mais opções'}
        </button>
        {showMore ? (
          <div className="mt-3 grid gap-3 md:grid-cols-6">
            <input value={subject} onChange={(event) => setSubject(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Disciplina" />
            <select value={status} onChange={(event) => setStatus(event.target.value as StudyListItem['status'])} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none">
              {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as StudyListItem['difficulty'])} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none">
              <option value="easy">Fácil</option>
              <option value="medium">Média</option>
              <option value="hard">Difícil</option>
            </select>
            <input value={estimatedMinutes} onChange={(event) => setEstimatedMinutes(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Minutos" inputMode="numeric" />
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
                <BookOpen className="shrink-0 text-tea-600" size={20} />
                <div className="min-w-0 flex-1">
                  <input value={item.topic} onChange={(event) => onUpdateItem(item.id, { topic: event.target.value })} className={`w-full min-w-0 bg-transparent font-semibold outline-none ${item.status === 'done' ? 'text-stone-400 line-through' : 'text-tea-900'}`} aria-label="Editar tópico" />
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-stone-500">
                    {item.subject ? <span>{item.subject}</span> : null}
                    {item.difficulty ? <span>{item.difficulty}</span> : null}
                    {item.estimatedMinutes ? <span>{item.estimatedMinutes} min</span> : null}
                    {item.dueDate ? <span>{item.dueDate}</span> : null}
                  </div>
                </div>
                <select
                  value={item.status}
                  onChange={(event) => onUpdateItem(item.id, { status: event.target.value as StudyListItem['status'], completed: event.target.value === 'done' })}
                  className="h-10 max-w-[145px] rounded-full border border-tea-900/10 bg-white/80 px-3 text-xs font-semibold outline-none"
                  aria-label="Status do tópico"
                >
                  {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <Link to="/foco" className="hidden h-10 items-center gap-2 rounded-full border border-tea-900/10 bg-white/80 px-3 text-xs font-semibold text-tea-700 sm:inline-flex">
                  <ExternalLink size={14} /> Foco
                </Link>
                <button type="button" onClick={() => onRemoveItem(item.id)} aria-label="Excluir tópico" className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-44 place-items-center rounded-3xl bg-linen/70 p-8 text-center font-display text-xl font-semibold text-tea-900">
            Liste os tópicos e acompanhe seu avanço.
          </div>
        )}
      </div>
    </div>
  );
}
