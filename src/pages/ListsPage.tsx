import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, CheckSquare, CupSoda, Leaf, MoreVertical, Plus, Search, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import leafAsset from '../../assets/01.png';
import sprigAsset from '../../assets/04.png';
import { HangingTag } from '../components/HangingTag';
import { CreateListModal } from '../components/lists/CreateListModal';
import { ListCard } from '../components/lists/ListCard';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { useSmartLists } from '../hooks/useSmartLists';
import type { SmartListType } from '../types/smartList';
import { sortSmartLists } from '../utils/smartLists';

type TypeFilter = 'all' | SmartListType;
type StatusFilter = 'active' | 'favorite' | 'archived';

const presetCards: Array<{ type: SmartListType; title: string; description: string; icon: typeof CheckSquare }> = [
  { type: 'simple', title: 'Lista simples', description: 'Checklist rápido para qualquer plano.', icon: CheckSquare },
  { type: 'shopping', title: 'Lista de compras', description: 'Produto, valor e total sempre à vista.', icon: ShoppingCart },
  { type: 'study', title: 'Lista de estudos', description: 'Tópicos, revisão e progresso leve.', icon: BookOpen },
];

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-tea-950">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
    </div>
  );
}

export function ListsPage() {
  const navigate = useNavigate();
  const { lists, createList, toggleFavorite, toggleArchived, duplicateList, deleteList } = useSmartLists();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [modalType, setModalType] = useState<SmartListType>('simple');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLists = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return sortSmartLists(lists).filter((list) => {
      const matchesType = typeFilter === 'all' || list.type === typeFilter;
      const matchesStatus =
        statusFilter === 'archived' ? list.archived : statusFilter === 'favorite' ? list.favorite && !list.archived : !list.archived;
      const matchesQuery = !cleanQuery || `${list.title} ${list.description ?? ''}`.toLowerCase().includes(cleanQuery);
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [lists, query, statusFilter, typeFilter]);

  const openCreate = (type: SmartListType = 'simple') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const removeList = (id: string) => {
    if (window.confirm('Excluir esta lista? Esta ação não pode ser desfeita.')) deleteList(id);
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
                  Listas <Leaf className="mb-2 inline text-tea-500" size={31} />
                </h1>
                <p className="mt-3 max-w-2xl text-base text-stone-500">Organize compras, estudos e ideias sem perder a leveza.</p>
              </motion.div>
              <HangingTag />
              <div className="flex items-center gap-3 self-end md:self-start">
                <button type="button" onClick={() => openCreate()} className="inline-flex h-12 items-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card transition hover:bg-tea-800">
                  <Plus size={18} /> Nova lista
                </button>
                {[Bell, CupSoda, MoreVertical].map((Icon, index) => (
                  <button key={index} type="button" aria-label={index === 0 ? 'Notificações' : index === 1 ? 'Chá e foco' : 'Mais opções'} className="hidden size-12 place-items-center rounded-full border border-tea-900/10 bg-white/78 text-tea-700 shadow-card sm:grid">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </header>

            <section className="rounded-[30px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
              <SectionHeading title="Encontrar listas" description="Busque, filtre por tipo e alterne entre listas ativas, favoritas ou arquivadas." />
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
                <label className="relative min-w-0">
                  <span className="sr-only">Buscar listas</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-tea-900/10 bg-linen/80 pl-11 pr-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10"
                    placeholder="Buscar listas"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['all', 'Todas'],
                    ['simple', 'Simples'],
                    ['shopping', 'Compras'],
                    ['study', 'Estudos'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTypeFilter(value as TypeFilter)}
                      className={`h-10 rounded-full px-4 text-sm font-semibold transition ${typeFilter === value ? 'bg-tea-700 text-white' : 'bg-linen text-stone-500 hover:bg-tea-50'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['active', 'Ativas'],
                    ['favorite', 'Favoritas'],
                    ['archived', 'Arquivadas'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatusFilter(value as StatusFilter)}
                      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${statusFilter === value ? 'bg-tea-100 text-tea-800' : 'bg-linen text-stone-500 hover:bg-tea-50'}`}
                    >
                      {value === 'favorite' ? <Star size={14} /> : null}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <SectionHeading title="Criar nova lista" description="Escolha um modelo para começar com a estrutura certa." />
              <div className="grid gap-4 md:grid-cols-3">
                {presetCards.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => openCreate(preset.type)}
                      className="group min-w-0 overflow-hidden rounded-[28px] border border-tea-900/10 bg-linen/72 p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:bg-white/82"
                    >
                      <span className="grid size-12 place-items-center rounded-2xl bg-tea-100 text-tea-700">
                        <Icon size={22} />
                      </span>
                      <h2 className="mt-4 font-display text-2xl font-semibold text-tea-900">{preset.title}</h2>
                      <p className="mt-1 text-sm leading-5 text-stone-500">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3">
              <SectionHeading title="Suas listas" description="Continue uma lista existente, duplique modelos ou arquive o que saiu do fluxo." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredLists.map((list) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    onFavorite={toggleFavorite}
                    onArchive={toggleArchived}
                    onDuplicate={(id) => {
                      const clone = duplicateList(id);
                      if (clone) navigate(`/listas/${clone.id}`);
                    }}
                    onDelete={removeList}
                  />
                ))}
              </div>
            </section>

            {!filteredLists.length ? (
              <section className="grid min-h-64 place-items-center rounded-[30px] border border-tea-900/10 bg-white/72 p-8 text-center shadow-card">
                <div className="max-w-md">
                  <Leaf className="mx-auto mb-3 text-tea-600" />
                  <h2 className="font-display text-2xl font-semibold text-tea-900">
                    {lists.length ? 'Nenhuma lista encontrada.' : 'Crie sua primeira lista para organizar o que não cabe em uma tarefa.'}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-500">Escolha um preset acima ou comece por uma lista em branco.</p>
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
      <MobileNav />
      <CreateListModal
        isOpen={isModalOpen}
        initialType={modalType}
        onClose={() => setIsModalOpen(false)}
        onCreate={(input) => {
          const list = createList(input);
          setIsModalOpen(false);
          if (list) navigate(`/listas/${list.id}`);
        }}
      />
    </div>
  );
}
