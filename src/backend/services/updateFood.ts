import { Food } from '../../types/Food';
import { loadItems, saveItems } from './storage';

export const updateFood = async (id: string, patch: Partial<Food>): Promise<Food> => {
    const items = await loadItems();
    const idx = items.findIndex((f: any) => String(f.id) === String(id));
    if (idx === -1) throw new Error('Not found');
    items[idx] = { ...items[idx], ...patch };
    await saveItems(items);
    return items[idx] as Food;
};
