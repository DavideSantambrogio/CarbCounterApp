import { Food } from '../../types/Food';
import { loadItems, saveItems } from './storage';

export const deleteFood = async (id: string): Promise<Food> => {
    const items = await loadItems();
    const idx = items.findIndex((f: any) => String(f.id) === String(id));
    if (idx === -1) throw new Error('Not found');
    const removed = items.splice(idx, 1)[0];
    await saveItems(items);
    return removed as Food;
};
