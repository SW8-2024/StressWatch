import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeString = async (key: string, value : string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
};

export const storeObject = async (key : string, value : object ) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {        
      // saving error
    }
};

export const getString = async (key : string) => {
    try {
      return await AsyncStorage.getItem(key);
    }
    catch (e) {
      // error reading value
    }
};

export const getMyObject = async (key : string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
      // read error
    }    
};

export const clearStorage = async () =>{
    try{
        await AsyncStorage.clear();
    }catch(e){
        // clear errro
    }
}