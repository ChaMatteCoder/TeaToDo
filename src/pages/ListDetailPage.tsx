import { useMemo } from 'react';
import { Archive, ArrowLeft, Bell, Copy, CupSoda, Leaf, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { HangingTag } from '../components/HangingTag';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { ShoppingListView } from '../components/lists/ShoppingListView';
import { SimpleListView } from '../components/lists/SimpleListView';
import { StudyListView } from '../components/lists/StudyListView';
import { useSmartLists } from '../hooks/useSmartLists';
import type { ShoppingListItem, StudyListItem } from '../types/smartList';

const typeLabel = {
  simple: 'Lista simples',
  shopping: 'Lista de compras',
  study: 'Lista de estudos',
};

export function ListDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const smartLists = useSmartLists();
  const list = useMemo(() => smartLists.lists.find((item) => item.id === id), [id, smartLists.lists]);

  if (!id) return <Navigate to="/listas" replace />;
  if (!list) {
    return (
      <div className="grid min-h-screen place-items-center bg-tea-50 p-6 text-center">
        <div className="rounded-[30px] border border-tea-900/10 bg-linen p-8 shadow-soft">
          <Leaf className="mx-auto mb-3 text-tea-600" />
          <h1 className="font-display text-3xl font-semibold text-tea-900">Lista não encontrada</h1>
          <Link to="/listas" className="mt-5 inline-flex h-11 items-center rounded-full bg-tea-700 px-5 text-sm font-semibold text-white">
            Voltar para Listas
          </Link>
        </div>
      </div>
    );
  }

  const removeList = () => {
    if (!window.confirm('Excluir esta lista? Esta ação não pode ser desfeita.')) return;
    smartLists.deleteList(list.id);
    navigate('/listas');
  };

  const duplicateCurrent = () => {
    const clone = smartLists.duplicateList(list.id);
    if (clone) navigate(`/listas/${clone.id}`);
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
              <div className="min-w-0">
                <Link to="/listas" className="mb-4 inline-flex h-10 items-center gap-2 rounded-full border border-tea-900/10 bg-white/70 px-4 text-sm font-semibold text-tea-700">
                  <ArrowLeft size={17} /> Listas
                </Link>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-tea-600">{typeLabel[list.type]}</p>
                <input
                  value={list.title}
                  onChange={(event) => smartLists.updateList(list.id, { title: event.target.value })}
                  className="mt-1 w-full min-w-0 bg-transparent font-display text-4xl font-semibold leading-tight text-tea-900 outline-none sm:text-5xl"
                  aria-label="Título da lista"
                />
                <textarea
                  value={list.description ?? ''}
                  onChange={(event) => smartLists.updateList(list.id, { description: event.target.value })}
                  className="mt-2 min-h-12 w-full resize-none bg-transparent text-base text-stone-500 outline-none"
                  placeholder="Descrição opcional da lista"
                  aria-label="Descrição da lista"
                />
              </div>
              <HangingTag />
              <div className="flex flex-wrap items-center gap-3 self-end md:self-start">
                <button type="button" onClick={() => smartLists.toggleFavorite(list.id)} aria-label="Favoritar lista" className={`grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 shadow-card ${list.favorite ? 'text-amber-500' : 'text-tea-700'}`}>
                  <Star size={20} fill={list.favorite ? 'currentColor' : 'none'} />
                </button>
                <button type="button" onClick={duplicateCurrent} aria-label="Duplicar lista" className="grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card">
                  <Copy size={20} />
                </button>
                <button type="button" onClick={() => smartLists.toggleArchived(list.id)} aria-label={list.archived ? 'Desarquivar lista' : 'Arquivar lista'} className="grid size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card">
                  <Archive size={20} />
                </button>
                <button type="button" onClick={removeList} aria-label="Excluir lista" className="grid size-12 place-items-center rounded-full border border-red-200 bg-white/78 text-red-600 shadow-card">
                  <Trash2 size={20} />
                </button>
                {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
                  <button key={index} type="button" aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'} className="hidden size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card sm:grid">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </header>

            {list.archived ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4 text-sm font-semibold text-amber-800 shadow-card">
                Esta lista está arquivada. Você ainda pode consultá-la ou desarquivar quando quiser.
              </div>
            ) : null}

            {list.type === 'simple' ? (
              <SimpleListView
                list={list}
                onAddItem={(item) => smartLists.addItem(list.id, item)}
                onToggleItem={(itemId) => smartLists.toggleItem(list.id, itemId)}
                onRemoveItem={(itemId) => smartLists.removeItem(list.id, itemId)}
                onUpdateItem={(itemId, changes) => smartLists.updateItem(list.id, itemId, changes)}
              />
            ) : null}

            {list.type === 'shopping' ? (
              <ShoppingListView
                list={list}
                onAddItem={(item) => smartLists.addItem(list.id, item)}
                onToggleItem={(itemId) => smartLists.toggleItem(list.id, itemId)}
                onRemoveItem={(itemId) => smartLists.removeItem(list.id, itemId)}
                onUpdateItem={(itemId, changes) => smartLists.updateItem(list.id, itemId, changes as Partial<ShoppingListItem>)}
                onUpdateList={(changes) => smartLists.updateList(list.id, changes)}
              />
            ) : null}

            {list.type === 'study' ? (
              <StudyListView
                list={list}
                onAddItem={(item) => smartLists.addItem(list.id, item)}
                onRemoveItem={(itemId) => smartLists.removeItem(list.id, itemId)}
                onUpdateItem={(itemId, changes) => smartLists.updateItem(list.id, itemId, changes as Partial<StudyListItem>)}
              />
            ) : null}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
