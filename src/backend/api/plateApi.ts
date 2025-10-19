import { loadPlate, addToPlate, removeFromPlate, clearPlate, subscribePlateListener } from '../services/storage';

export const getPlateApi = async () => {
    return await loadPlate();
};

export const addToPlateApi = async (item: any) => {
    await addToPlate(item);
};

export const removeFromPlateApi = async (id: string) => {
    await removeFromPlate(id);
};

export const clearPlateApi = async () => {
    await clearPlate();
};

export const subscribePlateApi = (listener: () => void) => {
    return subscribePlateListener(listener);
};
