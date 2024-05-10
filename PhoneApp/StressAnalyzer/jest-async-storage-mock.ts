import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
let storage = new Map<string,string>();

AsyncStorageMock.getItem = jest.fn(
  (input, callback?) => {    
    return new Promise((resolve,reject) => {
      let elem = storage.get(input);
      if (elem != undefined){
        resolve(elem);
      }else{
        reject();
      }
    });
  }
);

AsyncStorageMock.setItem = jest.fn((key, value, callback?) => {
  storage.set(key,value);
  return new Promise((resolve,reject) => {
      resolve();
  });
}
);

AsyncStorageMock.clear = jest.fn((callback?) => {
  storage.clear();
  return new Promise((resolve, reject) => {
    resolve();
  })
})

