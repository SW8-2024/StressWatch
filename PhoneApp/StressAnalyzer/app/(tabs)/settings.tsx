import { StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [apiUrl, setApiUrl] = useState('mlnfgl')

  useEffect(() => {
    try {
      AsyncStorage.getItem('api-url').then((value) => {
        if (value !== null) {
          setApiUrl(value)
        }
      })
    } catch (e) {
      console.log(e)
    }
  },[])

  const storeData = async (value:string) => {
    try {
      setApiUrl(value)
      await AsyncStorage.setItem('api-url', value);
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.api}>
        <Text style={styles.label}>API URL</Text>
        <TextInput
              style={styles.inputField}
              value={apiUrl}
              onChangeText={(text:string) => setApiUrl(text)}/>
      </View>
      <View style={styles.api}>
        <Text style={styles.label}>API URL</Text>
        <TextInput
              style={styles.inputField}
              value={apiUrl}
              onChangeText={(text:string) => storeData(text)}/>
      </View>
      <View style={styles.api}>
        <Text style={styles.label}>API URL</Text>
        <TextInput
              style={styles.inputField}
              value={apiUrl}
              onChangeText={(text:string) => storeData(text)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  api: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputField: {
    fontSize: 20,
    fontWeight: 'bold',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%'
  },
});
