import { Food } from '../../types/Food';
import { loadItems, saveItems } from './storage';

export const createFood = async (food: Partial<Food>): Promise<Food> => {
    const items = await loadItems();
    const created: Food = {
        id: (Date.now()).toString(),
        name: (food as any).name ?? 'Unnamed',
        carbs: (food as any).carbs ?? 0,
        ...food,
    } as Food;
    items.push(created);
    await saveItems(items);
    return created;
};
