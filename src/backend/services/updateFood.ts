import { Food } from '../../types/Food';
import RNFS from 'react-native-fs';

const dataFilePath = RNFS.DocumentDirectoryPath + '/data.json';

export const updateFood = async (updatedFood: Food): Promise<void> => {
    const data = await RNFS.readFile(dataFilePath, 'utf8');
    const foods: Food[] = JSON.parse(data);
    const index = foods.findIndex(f => f.id === updatedFood.id);
    if (index !== -1) {
        foods[index] = updatedFood;
        await RNFS.writeFile(dataFilePath, JSON.stringify(foods, null, 2), 'utf8');
    }
};
