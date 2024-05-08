import { Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { storeString, getString } from '@/helpers/AsyncStorage';
import {logout, authorize} from "@/helpers/Database"
import { style } from 'd3';

export default function SettingsScreen() {
  const [apiUrl, setApiUrl] = useState('')
  const [token, onChangeToken] = useState('');
  const [pairStatus, setPairStatus] = useState('')

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
    
    try {
      getString('pairStatus').then((value: string | null | undefined) => {
        if (value !== null && value !== undefined) {
          console.log('pairStatus: ', value)
          setPairStatus(value);
        }
      })
    } catch (e) {
      console.log(e)
    }

  },[pairStatus])

  const storeData = async (value:string) => {
    try {
      setApiUrl(value)
      await storeString('api-url', value);
    } catch (e) {
      console.log(e)
    }
  };

  const storeStatus = async (value: string) => {
    try {
      setPairStatus(value)
      await storeString('pairStatus', value);
    } catch (e) {
      console.log(e)
    }
  }

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
          <Text style={styles.statusText}>Status: {pairStatus}</Text>
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
          onPress={ async () => storeStatus(await authorize(token)) }/>
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
    fontSize: 16
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
