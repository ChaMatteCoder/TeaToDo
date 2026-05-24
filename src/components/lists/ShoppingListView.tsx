import { FormEvent, useMemo, useState } from 'react';
import { Calculator, Plus, ShoppingBasket, Trash2 } from 'lucide-react';
import type { ShoppingListItem, SmartList } from '../../types/smartList';
import { formatCurrencyBRL, parseCurrencyBRL } from '../../utils/currency';
import { getShoppingItemTotal, getShoppingTotals } from '../../utils/smartLists';

interface ShoppingListViewProps {
  list: SmartList;
  onAddItem: (item: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, changes: Partial<ShoppingListItem>) => void;
  onUpdateList: (changes: Partial<SmartList>) => void;
}

const units = ['un', 'kg', 'g', 'L', 'ml', 'pacote', 'caixa', 'outro'] as const;
const categories = ['Mercado', 'Feira', 'Limpeza', 'Higiene', 'Padaria', 'Carnes', 'Bebidas', 'Outros'];

export function ShoppingListView({ list, onAddItem, onToggleItem, onRemoveItem, onUpdateItem, onUpdateList }: ShoppingListViewProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<ShoppingListItem['unit']>('un');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [shoppingMode, setShoppingMode] = useState(false);
  const [error, setError] = useState('');
  const items = useMemo(
    () => list.items.filter((item): item is ShoppingListItem => item.type === 'shopping').sort((a, b) => Number(a.completed) - Number(b.completed)),
    [list.items],
  );
  const totals = getShoppingTotals(items);
  const budget = Number(list.settings?.budget ?? 0);
  const remaining = budget ? budget - totals.total : 0;
  const showAdvanced = Boolean(list.settings?.showAdvancedShoppingFields);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const parsedPrice = parseCurrencyBRL(price);
    if (!cleanName) {
      setError('Informe o produto.');
      return;
    }
    if (Number.isNaN(parsedPrice)) {
      setError('Informe um valor válido.');
      return;
    }
    const parsedQuantity = quantity ? Number(quantity.replace(',', '.')) : 1;
    onAddItem({
      type: 'shopping',
      name: cleanName,
      price: parsedPrice,
      quantity: Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1,
      unit: showAdvanced ? unit : undefined,
      category: showAdvanced ? category : undefined,
      note: showAdvanced ? note.trim() : undefined,
    });
    setName('');
    setPrice('');
    setQuantity('');
    setUnit('un');
    setCategory('');
    setNote('');
    setError('');
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          ['Total geral', formatCurrencyBRL(totals.total)],
          ['Comprado', formatCurrencyBRL(totals.bought)],
          ['Pendente', formatCurrencyBRL(totals.pending)],
          ['Produtos', totals.count],
          ['Comprados', totals.boughtCount],
          ['Pendentes', totals.count - totals.boughtCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-tea-900/10 bg-white/70 p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-tea-600">{label}</p>
            <p className="mt-2 truncate font-display text-2xl font-semibold text-tea-900">{value}</p>
          </div>
        ))}
      </div>

      {budget ? (
        <div className={`rounded-3xl border p-4 text-sm font-semibold shadow-card ${remaining >= 0 ? 'border-tea-900/10 bg-tea-50 text-tea-800' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
          Orçamento: {formatCurrencyBRL(budget)} · {remaining >= 0 ? 'Restante' : 'Ultrapassou'} {formatCurrencyBRL(Math.abs(remaining))}
        </div>
      ) : null}

      <form onSubmit={submit} className="rounded-[28px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Produto</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" placeholder="Produto" />
          </label>
          <label className="lg:w-44">
            <span className="sr-only">Valor</span>
            <input value={price} onChange={(event) => setPrice(event.target.value)} className="h-12 w-full rounded-2xl border border-tea-900/10 bg-linen/80 px-4 outline-none focus:border-tea-500/50 focus:ring-4 focus:ring-tea-500/10" placeholder="Valor" inputMode="decimal" />
          </label>
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tea-700 px-5 text-sm font-semibold text-white shadow-card">
            <Plus size={18} /> Adicionar
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <button type="button" onClick={() => onUpdateList({ settings: { ...list.settings, showAdvancedShoppingFields: !showAdvanced } })} className="font-semibold text-tea-700">
            {showAdvanced ? 'Ocultar opções' : 'Mais opções'}
          </button>
          <label className="inline-flex items-center gap-2 font-semibold text-stone-500">
            <input type="checkbox" checked={shoppingMode} onChange={(event) => setShoppingMode(event.target.checked)} className="size-4 accent-tea-700" />
            Modo compra
          </label>
        </div>
        {showAdvanced ? (
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            <input value={quantity} onChange={(event) => setQuantity(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Qtd." inputMode="decimal" />
            <select value={unit} onChange={(event) => setUnit(event.target.value as ShoppingListItem['unit'])} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none">
              {units.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none">
              <option value="">Categoria</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input value={note} onChange={(event) => setNote(event.target.value)} className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none" placeholder="Observação" />
            <input
              value={budget || ''}
              onChange={(event) => onUpdateList({ settings: { ...list.settings, budget: parseCurrencyBRL(event.target.value) || 0 } })}
              className="h-11 rounded-2xl border border-tea-900/10 bg-linen/80 px-3 outline-none"
              placeholder="Orçamento"
              inputMode="decimal"
            />
          </div>
        ) : null}
        {error ? <p className="mt-2 text-sm font-semibold text-amber-700">{error}</p> : null}
      </form>

      <div className="rounded-[28px] border border-tea-900/10 bg-white/72 p-4 shadow-card">
        {items.length ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.id} className={`flex min-w-0 items-center gap-3 rounded-2xl border border-tea-900/10 bg-linen/70 p-3 ${shoppingMode ? 'text-lg' : ''}`}>
                <button type="button" onClick={() => onToggleItem(item.id)} aria-label={item.completed ? 'Marcar produto pendente' : 'Marcar produto comprado'} className={`grid shrink-0 place-items-center rounded-full border ${shoppingMode ? 'size-9' : 'size-7'} ${item.completed ? 'border-tea-600 bg-tea-600 text-white' : 'border-stone-300 bg-white'}`}>
                  {item.completed ? '✓' : ''}
                </button>
                <ShoppingBasket className="hidden shrink-0 text-tea-500 sm:block" size={18} />
                <div className="min-w-0 flex-1">
                  <input value={item.name} onChange={(event) => onUpdateItem(item.id, { name: event.target.value })} className={`w-full min-w-0 bg-transparent font-semibold outline-none ${item.completed ? 'text-stone-400 line-through' : 'text-tea-900'}`} aria-label="Editar produto" />
                  {!shoppingMode ? (
                    <p className="mt-1 truncate text-xs text-stone-500">
                      {item.category || 'Sem categoria'} {item.quantity && item.quantity !== 1 ? `· ${item.quantity} ${item.unit ?? ''}` : ''} {item.note ? `· ${item.note}` : ''}
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-xl font-semibold text-tea-900">{formatCurrencyBRL(getShoppingItemTotal(item))}</p>
                  {!shoppingMode ? <p className="text-xs font-semibold text-stone-400">{item.completed ? 'Comprado' : 'Pendente'}</p> : null}
                </div>
                <button type="button" onClick={() => onRemoveItem(item.id)} aria-label="Excluir produto" className="grid size-9 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid min-h-44 place-items-center rounded-3xl bg-linen/70 p-8 text-center">
            <div>
              <Calculator className="mx-auto mb-3 text-tea-600" />
              <p className="font-display text-xl font-semibold text-tea-900">Adicione um produto e deixe o TeaToDo cuidar da soma.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
