import { Food } from '../../types/Food';
import { loadItems } from './storage';

export const readFoods = async (): Promise<Food[]> => {
    const items = await loadItems();
    return items as Food[];
};
