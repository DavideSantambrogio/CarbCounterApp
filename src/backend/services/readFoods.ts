import { Food } from '../../types/Food';
import RNFS from 'react-native-fs';

const dataFilePath = RNFS.DocumentDirectoryPath + '/data.json';

export const readFoods = async (): Promise<Food[]> => {
    const fileExists = await RNFS.exists(dataFilePath);
    if (!fileExists) {
        await RNFS.writeFile(dataFilePath, '[]', 'utf8');
        return [];
    }
    const data = await RNFS.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
};
