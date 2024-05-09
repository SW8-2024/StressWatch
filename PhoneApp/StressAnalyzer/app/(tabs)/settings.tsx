import { Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { storeString, getString } from '@/helpers/AsyncStorage';
import {logout, authorize} from "@/helpers/Database"
import { style } from 'd3';

export default function SettingsScreen() {
  const [apiUrl, setApiUrl] = useState('')
  const [token, onChangeToken] = useState('');
  const [pairStatus, setPairStatus] = useState('')
  const [authResponse, setAuthResponse] = useState('');

  useEffect(() => {
    console.log("useEffect")
    try {
      getString('api-url').then((value: string | null | undefined) => {
          if (value !== null && value !== undefined) {
            console.log('item', value)
            setApiUrl(value);
          }
      });
    } catch (e) {
      console.log(e)
    }
  },[])

  // Only runs if the screen is currently focused
  useFocusEffect(
    useCallback(() => {
      setAuthResponse('');
    }, [])
  );

  const storeData = async (value:string) => {
    try {
      setApiUrl(value)
      await storeString('api-url', value);
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
              onChangeText={(text:string) => storeData(text)}/>
              <Pressable 
          style={styles.buttonAlt} 
          onPress={() => logout()}>
          <Text>Log out</Text>        
        </Pressable>
      </View>
      <View style={styles.inputToken}>
        <Text style={styles.label}>Pair watch</Text>
        <View style={styles.pairStatus}>
          <Text style={styles.statusText}>Last received heart rate: 1 min ago</Text>
        </View>
        <TextInput
          style={styles.inputField}
          keyboardType='numeric'
          onChangeText={onChangeToken}
          value={token}
          placeholder='Enter auth token'/>
        <Button
          title="Pair now"
          color="green"
          onPress={ async () => {setAuthResponse(await authorize(token)); onChangeToken('')} }/>
        <Text style={styles.responseText}>{authResponse}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  api: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputToken: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pairStatus: {
    alignSelf: 'flex-start',
    paddingLeft: 50
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    margin: 4
  },
  responseText: {
    fontSize: 16,
    paddingTop: 4
  },
  inputField: {
    backgroundColor: '#555555',
    color:'white',
    borderRadius: 8,
    fontSize: 20,
    fontWeight: 'bold',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%'
  },
  buttonAlt: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: 150,      
    backgroundColor: 'gray',
    margin: 8,
  },
});
