import { Archive, BookOpen, CheckSquare, Copy, MoreVertical, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SmartList, SmartListType } from '../../types/smartList';
import { getListProgress, getShoppingTotals, getStudyTotals } from '../../utils/smartLists';
import { formatCurrencyBRL } from '../../utils/currency';

interface ListCardProps {
  list: SmartList;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeMeta: Record<SmartListType, { label: string; icon: typeof CheckSquare; tone: string }> = {
  simple: { label: 'Simples', icon: CheckSquare, tone: 'bg-tea-100 text-tea-700' },
  shopping: { label: 'Compras', icon: ShoppingCart, tone: 'bg-amber-100 text-amber-800' },
  study: { label: 'Estudos', icon: BookOpen, tone: 'bg-oat text-clay' },
};

const updatedLabel = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function ListCard({ list, onFavorite, onArchive, onDuplicate, onDelete }: ListCardProps) {
  const meta = typeMeta[list.type];
  const Icon = meta.icon;
  const progress = getListProgress(list);
  const shoppingTotals = list.type === 'shopping' ? getShoppingTotals(list.items) : null;
  const studyTotals = list.type === 'study' ? getStudyTotals(list.items) : null;

  return (
    <article className="group relative flex min-h-[240px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-tea-900/10 bg-white/72 p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-tea-100/55 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${meta.tone}`}>
          <Icon size={22} />
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onFavorite(list.id)} aria-label={list.favorite ? 'Remover dos favoritos' : 'Favoritar lista'} className={`grid size-9 place-items-center rounded-full border border-tea-900/10 bg-linen/80 ${list.favorite ? 'text-amber-500' : 'text-stone-400'}`}>
            <Star size={17} fill={list.favorite ? 'currentColor' : 'none'} />
          </button>
          <details className="relative">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-full border border-tea-900/10 bg-linen/80 text-stone-500 [&::-webkit-details-marker]:hidden">
              <MoreVertical size={17} />
            </summary>
            <div className="absolute right-0 top-11 z-20 w-44 rounded-2xl border border-tea-900/10 bg-linen p-2 text-sm shadow-soft">
              <Link to={`/listas/${list.id}`} className="block rounded-xl px-3 py-2 font-semibold text-tea-800 hover:bg-tea-50">
                Abrir
              </Link>
              <button type="button" onClick={() => onDuplicate(list.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-stone-600 hover:bg-tea-50">
                <Copy size={15} /> Duplicar
              </button>
              <button type="button" onClick={() => onArchive(list.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-stone-600 hover:bg-tea-50">
                <Archive size={15} /> {list.archived ? 'Desarquivar' : 'Arquivar'}
              </button>
              <button type="button" onClick={() => onDelete(list.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-red-600 hover:bg-red-50">
                <Trash2 size={15} /> Excluir
              </button>
            </div>
          </details>
        </div>
      </div>

      <Link to={`/listas/${list.id}`} className="relative mt-5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-tea-50 px-3 py-1 text-xs font-bold text-tea-700">{meta.label}</span>
          {list.archived ? <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">Arquivada</span> : null}
        </div>
        <h2 className="mt-3 truncate font-display text-2xl font-semibold text-tea-900">{list.title}</h2>
        <p className="mt-1 line-clamp-2 min-h-[40px] text-sm leading-5 text-stone-500">
          {list.description || 'Uma lista pronta para guardar o que precisa de espaço fora das tarefas.'}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-stone-500">
            <span>{progress.completed} de {progress.total} itens</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-oat">
            <div className="h-full rounded-full bg-tea-600 transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {shoppingTotals ? (
            <>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">Total {formatCurrencyBRL(shoppingTotals.total)}</span>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">Pend. {formatCurrencyBRL(shoppingTotals.pending)}</span>
            </>
          ) : studyTotals ? (
            <>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">{studyTotals.studying} em estudo</span>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">{studyTotals.reviewing} revisão</span>
            </>
          ) : (
            <>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">{progress.pending} pendentes</span>
              <span className="rounded-2xl bg-linen px-3 py-2 font-semibold text-stone-600">{progress.completed} concluídos</span>
            </>
          )}
        </div>
      </Link>

      <p className="relative mt-4 border-t border-tea-900/10 pt-3 text-xs font-medium text-stone-400">Atualizada em {updatedLabel(list.updatedAt)}</p>
    </article>
  );
}
