import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { login } from '@/helpers/Database';
import {ChillChaser} from '@/components/name'

export default function loginScreen () {
  const [email, setEmail] = useState('test@.com') //Default values for testing
  const [password, setPassword] = useState('Password1!')
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const [authing, setAuthing] = useState(false)
  
  const toggleHidePassword = () => setHidePassword(!hidePassword)
  
  async function tryLogin () {    
    setAuthing(true);
    let success = await login(email, password);    
    setAuthing(false);
    if (!success){
        setWrongCredentials(true);     
    }else{
        setWrongCredentials(false);
        router.replace("/mainPage");
    }
  }

  return (
    <View style={styles.container}>   
        <ChillChaser></ChillChaser>     
        <View style={styles.textboxContainer}>
          <Text style={styles.descriptiveText}>Email</Text>
          <View style={styles.inputBox}>
            <TextInput inputMode='email' autoComplete={'email'} style={styles.inputField}
                          value={email}
                          onChangeText={(email : string) => setEmail(email)}/>
          </View>                      
        </View> 
        <View style={styles.textboxContainer}>
          <Text style={styles.descriptiveText}>Password</Text>
          <View style={styles.inputBox}>
            <TextInput secureTextEntry={hidePassword} style={styles.inputField}
                      autoCapitalize='none'
                      value={password}
                      onChangeText={(password : any) => setPassword(password)}/>
            <MaterialCommunityIcons
                      name={hidePassword ? 'eye' : 'eye-off'}                   
                      style={styles.eye}
                      size={24}
                      onPress={toggleHidePassword}/>
          </View>
        </View>    
        {wrongCredentials && <Text style={styles.error}> Wrong credentials</Text>}
        <View style={styles.separator}/>
        <Pressable 
          style={styles.button} 
          onPress={()=>{
            if (!authing){
              tryLogin();
            }
          }}>
            <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>
        <Pressable 
          style={styles.buttonAlt} 
          onPress={() => router.navigate('/createAccount')}>
          <Text style={styles.buttonText}>Create new account</Text>        
        </Pressable>
    </View>
  );
}