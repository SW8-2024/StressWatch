import { Redirect, SplashScreen } from 'expo-router';
import { Component, useCallback, useEffect, useState } from 'react';
import {getString} from "@/helpers/AsyncStorage";
import {refreshAuthorization} from "@/helpers/Database";
import * as Network from 'expo-network';


export default function RedirectBasedOnLoginState() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const prepare : any = async () => {
      let networkState = await Network.getNetworkStateAsync();
      //If token is valid go directly to logged in screen
      //If not offline go directly to logged in screen 
      //If neither then first check if refreshToken is valid
      if (await getString("authorizedUntil")
        .then((res : any) => {return typeof(res) == "string" && res > Date()})
      ){
        refreshAuthorization();
        setLoggedIn(true);
      }
      else if (networkState.isInternetReachable){
        setLoggedIn(await refreshAuthorization());
      }else{
        setLoggedIn(typeof(await getString("accessToken")) == "string");
      }
      setAppIsReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  
  if (!appIsReady) {
    return null;
  }else if (loggedIn){
    return <Redirect href='/mainPage'/>
  }else{
    return <Redirect href='/login'/>
  }
   
}