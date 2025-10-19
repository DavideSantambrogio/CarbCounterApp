import { loadPlate, addToPlate, removeFromPlate, clearPlate, subscribePlateListener } from '../services/storage';
import { updatePlateItem } from '../services/storage';

export const getPlateApi = async () => {
    return await loadPlate();
};

export const addToPlateApi = async (item: any) => {
    return await addToPlate(item);
};

export const removeFromPlateApi = async (id: string) => {
    await removeFromPlate(id);
};

export const clearPlateApi = async () => {
    await clearPlate();
};

export const updatePlateItemApi = async (id: string, patch: any) => {
    return await updatePlateItem(id, patch);
};

export const subscribePlateApi = (listener: () => void) => {
    return subscribePlateListener(listener);
};
