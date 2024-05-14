import { StyleSheet } from 'react-native';
import {Dimensions} from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"#3ab3cc",
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    error: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'red',
    },
    descriptiveText: {
      fontSize: 13,    
      color: 'white',
    },
    separator: {
      marginVertical: 20,
      height: 1,
      width: '80%',
      opacity: 0.3,
      backgroundColor: 'white', 
    },
    inputField: {
      height: 40, 
      width: 0.65 * Dimensions.get('window').width,      
      padding: 4,
      justifyContent: 'center',
      color: 'white',      
    },
    eye: {
      marginLeft: -28, // -(eyesize+paddingRight)
      paddingRight: 4,
      color:'#aaa',      
    },
    inputBox: {
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',    
      backgroundColor: 'black',
      opacity: 0.7,
      borderRadius: 4,
      color: 'white',
    },
    backgroundImage: {    
      justifyContent: 'center',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: 'center',  
      resizeMode: 'cover',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      width: 0.65 * Dimensions.get('window').width,      
      backgroundColor: '#280f9f',
      margin: 8,
    },
    buttonAlt: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      width: 0.65 * Dimensions.get('window').width,      
      backgroundColor: 'gray',
      margin: 8,
    },
    disabledButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      width: 0.65 * Dimensions.get('window').width,      
      backgroundColor: 'grey',
      margin: 8,
    },
    buttonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
    explainerText: {
      fontSize: 17,    
      color: 'white',    
    },
    textboxContainer: {
      paddingBottom: 10,
      backgroundColor: 'transparent',
    },
    qrCodeIcon: {
      width: 32,
    },
    modalContainer: {
      justifyContent: 'center',
      borderRadius: 10,
      padding: 20,
      height: 400
    },
  });

  export default styles