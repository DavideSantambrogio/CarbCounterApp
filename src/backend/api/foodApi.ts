import { Food } from '../../types/Food';
import { createFood } from '../services/createFood';
import { readFoods } from '../services/readFoods';
import { updateFood } from '../services/updateFood';
import { deleteFood } from '../services/deleteFood';

// API per il frontend: wrapper async attorno ai servizi locali

export const getFoodsApi = async (): Promise<Food[]> => {
    return await readFoods();
};

export const addFoodApi = async (food: Partial<Food>): Promise<Food> => {
    return await createFood(food);
};

export const updateFoodApi = async (id: string, patch: Partial<Food>): Promise<Food> => {
    return await updateFood(id, patch);
};

export const deleteFoodApi = async (id: string): Promise<Food> => {
    return await deleteFood(id);
};
