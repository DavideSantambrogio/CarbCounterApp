import { Food } from '../../types/Food';

import RNFS from 'react-native-fs';

const dataFilePath = RNFS.MainBundlePath + '/src/assets/data.json';

export const createFood = async (food: Food): Promise<void> => {
    const data = await RNFS.readFile(dataFilePath, 'utf8');
    const foods: Food[] = JSON.parse(data);
    foods.push(food);
    await RNFS.writeFile(dataFilePath, JSON.stringify(foods, null, 2), 'utf8');
};
