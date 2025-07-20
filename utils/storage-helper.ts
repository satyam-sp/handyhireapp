import AsyncStorage from '@react-native-async-storage/async-storage';

// Save to local storage
export const setStorageData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Saving error', e);
  }
};

// Read from local storage
export const getStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value && JSON.parse(value);
  } catch (e) {
    console.error('Reading error', e);
  }
};

// Remove from local storage
export const removeStorageData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Remove error', e);
  }
};
export const getToken = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      debugger

      return value && JSON.parse(value).token;
    } catch (e) {
      console.error('Reading error', e);
    }
  };