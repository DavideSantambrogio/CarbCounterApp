import { Food } from '../../types/Food';

import RNFS from 'react-native-fs';

const dataFilePath = RNFS.MainBundlePath + '/src/assets/data.json';

export const deleteFood = async (id: string): Promise<void> => {
    const data = await RNFS.readFile(dataFilePath, 'utf8');
    const foods: Food[] = JSON.parse(data);
    const newFoods = foods.filter(f => f.id !== id);
    await RNFS.writeFile(dataFilePath, JSON.stringify(newFoods, null, 2), 'utf8');
};
