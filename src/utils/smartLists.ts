import type { ShoppingListItem, SmartList, SmartListItem, StudyListItem } from '../types/smartList';

export function getListProgress(list: SmartList) {
  const total = list.items.length;
  const completed = list.items.filter((item) => item.completed).length;
  const pending = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, percent };
}

export function getShoppingItemTotal(item: ShoppingListItem) {
  return item.price * (item.quantity && item.quantity > 0 ? item.quantity : 1);
}

export function getShoppingTotals(items: SmartListItem[]) {
  const shoppingItems = items.filter((item): item is ShoppingListItem => item.type === 'shopping');
  const total = shoppingItems.reduce((sum, item) => sum + getShoppingItemTotal(item), 0);
  const bought = shoppingItems.filter((item) => item.completed).reduce((sum, item) => sum + getShoppingItemTotal(item), 0);
  return { total, bought, pending: total - bought, count: shoppingItems.length, boughtCount: shoppingItems.filter((item) => item.completed).length };
}

export function getStudyTotals(items: SmartListItem[]) {
  const studyItems = items.filter((item): item is StudyListItem => item.type === 'study');
  return {
    total: studyItems.length,
    done: studyItems.filter((item) => item.status === 'done').length,
    studying: studyItems.filter((item) => item.status === 'studying').length,
    reviewing: studyItems.filter((item) => item.status === 'reviewing').length,
    percent: studyItems.length ? Math.round((studyItems.filter((item) => item.status === 'done').length / studyItems.length) * 100) : 0,
  };
}

export function sortSmartLists(lists: SmartList[]) {
  return [...lists].sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.updatedAt.localeCompare(a.updatedAt));
}
