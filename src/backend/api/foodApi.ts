import { Food } from '../../types/Food';
import { createFood, readFoods, updateFood, deleteFood } from '../services';

// API per il frontend: funzioni che simulano chiamate API locali

export const getFoodsApi = async (): Promise<Food[]> => {
    return await readFoods();
};

export const addFoodApi = async (food: Food): Promise<void> => {
    await createFood(food);
};

export const updateFoodApi = async (food: Food): Promise<void> => {
    await updateFood(food);
};

export const deleteFoodApi = async (id: string): Promise<void> => {
    await deleteFood(id);
};
