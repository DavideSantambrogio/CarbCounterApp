import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../../assets/data.json';

export const STORAGE_KEY = '@CarbCounterApp:data';

export const PLATE_KEY = '@CarbCounterApp:plate';

export async function loadItems(): Promise<any[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            return (parsed as any).foods ?? parsed;
        } catch {
            // fallthrough to bundled data
        }
    }

    const initial = (data as any).foods ?? data;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
}

export async function saveItems(items: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Plate management (temporary dish list)
export async function loadPlate(): Promise<any[]> {
    const raw = await AsyncStorage.getItem(PLATE_KEY);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }
    return [];
}

export async function savePlate(items: any[]): Promise<void> {
    await AsyncStorage.setItem(PLATE_KEY, JSON.stringify(items));
    notifyPlateListeners();
}

export async function addToPlate(item: any): Promise<void> {
    const plate = await loadPlate();
    plate.push(item);
    await savePlate(plate);
}

export async function removeFromPlate(id: string): Promise<void> {
    const plate = await loadPlate();
    const idx = plate.findIndex((p: any) => String(p.id) === String(id));
    if (idx !== -1) {
        plate.splice(idx, 1);
        await savePlate(plate);
    }
}

export async function clearPlate(): Promise<void> {
    await savePlate([]);
}

// --- listeners for plate changes ---
type PlateListener = () => void;
const plateListeners: PlateListener[] = [];

export function subscribePlateListener(listener: PlateListener): () => void {
    plateListeners.push(listener);
    return () => {
        const idx = plateListeners.indexOf(listener);
        if (idx !== -1) plateListeners.splice(idx, 1);
    };
}

function notifyPlateListeners() {
    plateListeners.slice().forEach(l => {
        try { l(); } catch (e) { /* ignore listener errors */ }
    });
}
// done: notifications are triggered from savePlate
