import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStorage, createRepositories } from '@haedda/storage';

const storage = createNativeStorage(AsyncStorage);

export const appStorage = createRepositories(storage);
