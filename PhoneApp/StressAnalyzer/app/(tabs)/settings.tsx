import { StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {logout, authorize} from "@/helpers/Database"

import Button from '@/components/Button';

export default function SettingsScreen() {
  const [token, onChangeToken] = useState('');
  const [authResponse, setAuthResponse] = useState('');

  useEffect(() => {
    console.log("useEffect")
  },[])

  // Only runs if the screen is currently focused
  useFocusEffect(
    useCallback(() => {
      setAuthResponse('');
    }, [])
  );

  return (
    <View style={styles.container}>
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
          text='Pair now'
          textColor='white'
          bgColor='green'
          action={async () => {setAuthResponse(await authorize(token)); onChangeToken('')}}/>
        <Text style={styles.responseText}>{authResponse}</Text>
      </View>
      <View style={styles.logoutBtn}>
        <Button
          text='Log out'
          textColor='white'
          bgColor='red'
          action={logout}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  logoutBtn: {
    alignItems: 'center',
    margin: 12
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
});
