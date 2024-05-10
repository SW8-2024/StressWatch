import {Button, TextInput, View, Text} from 'react-native'
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native'
import { useRef, useState } from 'react'
import { login, logout, receiveUsageData, register, refreshAuthorization } from '@/helpers/Database';
import {resetServerDb, server} from '@/serverSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UserHandlerTestScreen(props: {registerCallback? : () => void, loginCallback? : (response : boolean) => void}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  return (
    <View>
      <TextInput value={password} onChangeText={setPassword} testID="password" />
      <TextInput value={email} onChangeText={setEmail} testID="email" />
      <Button
        title="createUser"
        testID='createUserButton'
        onPress={async () => {
          await register(email, password);
          if (props.registerCallback != undefined){
            props.registerCallback();
          }
        }
      }
      />
      <Button
        title="login"
        testID='loginButton'
        onPress={async () => {             
          let response = await login(email,password);
          if (props.loginCallback != undefined){
            props.loginCallback(response);
          }
          }
        }
      />
      <Button
        title="logout"
        testID='logoutButton'
        onPress={() => {             
          logout();
          }
        }
      />      
    </View>    
  )
}

beforeAll(() => server.listen());

afterEach(() => {  
  resetServerDb();
  AsyncStorage.clear();
  }
);

afterAll(() => server.close());

describe('loginScreen', () => {
  it('should be able to create a user and log in', (done) => {
    render(<UserHandlerTestScreen 
      registerCallback={() => {
      fireEvent.press(screen.getByTestId("loginButton"));
    }} 
    loginCallback={(response : boolean) => {      
      expect(response).toBe(true);      
      done();      
    }
    }
    />)
    fireEvent.changeText(screen.getByTestId("password"),"Password");
    fireEvent.changeText(screen.getByTestId("email"),"email@test");
    fireEvent.press(screen.getByTestId("createUserButton"));
  });

  it('should not be able to log in as a non-existing user', (done) => {
    render(<UserHandlerTestScreen
    loginCallback={(response : boolean) => {
      expect(response).toBe(false);      
      done();
    }
    }
    />)
    fireEvent.changeText(screen.getByTestId("password"),"Password");
    fireEvent.changeText(screen.getByTestId("email"),"email@test");
    fireEvent.press(screen.getByTestId("loginButton"));
  });

  it('should not be able to log in if registering failed', (done) => {
    render(<UserHandlerTestScreen
      registerCallback={() => {
      fireEvent.press(screen.getByTestId("loginButton"));
    }}
    loginCallback={(response : boolean) => {
      expect(response).toBe(false);
      done();
    }}
    />)
    fireEvent.changeText(screen.getByTestId("password"),"pass");
    fireEvent.press(screen.getByTestId("createUserButton"));
  });

  it('should be able to refresh authorization when logged in', (done) => {
    render(<UserHandlerTestScreen 
      registerCallback={() => {
      fireEvent.press(screen.getByTestId("loginButton"));
    }} 
      loginCallback={(response : boolean) => {     
        expect(response).toBe(true);     
        refreshAuthorization().then(bool => {
          expect(bool).toBe(true);
          done();
        })      
      }}
    />)
    fireEvent.changeText(screen.getByTestId("password"),"Uncrackable");
    fireEvent.changeText(screen.getByTestId("email"),"myname@mail.com");
    fireEvent.press(screen.getByTestId("createUserButton"));
  });
  it('should not be able to refresh authorization when not logged in', (done) => {
    render(<UserHandlerTestScreen/>);
    refreshAuthorization().then(bool => {
      expect(bool).toBe(false);
      done();
    })    
  });
});
