import {storeString, getString, clearStorage} from '@/helpers/AsyncStorage';
import { router } from 'expo-router';
//To test locally run backend locally and use something like ngrok to connect on phone
//ngrok http --domain=emerging-teaching-stag.ngrok-free.app 2345
const serverLocation = 'https://chillchaser.ovh/';

export async function sendUsageData(data : EventUsageTransformedData[]) {  
  let url : string = serverLocation + "api/DataCollection/app-usage";  
  let res : boolean = false;
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized){
    console.log("Not authorized to sendUsageData")
    await refreshAuthorization();
  }
  else{
    try{
      let response : Response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(data),
      })
      if (response.status == 200){
        res = true;
      }
    }catch (e) {
      console.log("Error: " + e);
    }
  }
  return res;
}

export async function receiveUsageData(){
  let ret : AppUsageResponse[] = [];
  let url : string = serverLocation + "api/DataCollection/app-usage";  
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized){
    console.log("Not authorized to receiveUsageData")
    await refreshAuthorization();
  }
  else{
    try{
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',        
          'Authorization': 'Bearer ' + accessToken
        },
      });
      if (response.status == 200){
        ret = await response.json();
      }
    }catch (e){
      console.log("Error: " + e);      
    }
  }
  return ret;
}
export async function register(email : string, password : string) : Promise<any>{
  let url = serverLocation + "register";
  let ret : any = new Response();
  try{
    let response : Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({
              "email": email,
              "password": password            
      }),
    })
    if (response.status == 200){
      ret = response;      
    }else{
      ret = response.json();
    } 
  }catch(e){
    console.log("Error: " + e);    
  }  
  return ret;
}

async function checkIfAuthorized() : Promise<[boolean,string]>{
  let authorized = false;
  let accessToken = await getString("accessToken");
  let authorizedUntil = await getString("authorizedUntil");
  if (typeof(accessToken) == "string"){
    if (typeof(authorizedUntil) == "string" && parseInt(authorizedUntil) > Date.now()){
      authorized = true;
    }
  }else{
    accessToken = "";
  }
  return [authorized,accessToken];
}

export async function login(email : string, password : string){
  let url = serverLocation + "login";
  let ret = false;
  try{
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',      
      },
      body: JSON.stringify({
              "email": email,
              "password": password                
      }),
    });
    if (response.status == 200){
      ret = true;
      let resp = await response.json();
      await storeString("accessToken", resp.accessToken);
      await storeString("refreshToken", resp.refreshToken);
      await storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());
    }
  }catch(e){
    console.log("Error: " + e);
    return false;
  }
  return ret;
}

export async function authorize(token: string) : Promise<string> {
  const data = {
    token: token
  }

  let url : string = serverLocation + "api/Watch/authorize";
  let [authorized, accessToken] = await checkIfAuthorized();

  if (!authorized) {
    return "Not authorized";
  }
  
  let response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
      'Authorization': 'Bearer ' + accessToken

    },
    body: JSON.stringify(data),
  })

  if (response.status == 200){
    return `${response.status} Authorized`;
  } else {
    return `${response.status} ${((await response.text()).replaceAll('"', ' '))}`;
  }
}

export async function refreshAuthorization() : Promise<boolean>{
  let url = serverLocation + "refresh";
  let ret = false;

  let authorizedUntil = await getString("authorizedUntil");
  if (authorizedUntil == null || authorizedUntil == undefined || parseInt(authorizedUntil) < Date.now()){
    console.log("Cannot refresh authorization");
    return ret;
  }

  let refreshToken = await getString("refreshToken");
  if (refreshToken == null || refreshToken == undefined){
    return false;
  };
  try{
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({            
              "refreshToken": refreshToken,
      }),
    });
    if (response.status == 200){
      ret = true;
      let resp = await response.json();
      await storeString("accessToken", resp.accessToken);
      await storeString("refreshToken", resp.refreshToken);
      await storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());
    }
  }catch(e){
    console.log("Error: " + e);
    return false;
  }
  return ret;
}

///>TODO: Use AsyncStorage to set pairStatus when getting heart rate data
// AsyncStorage.setItem('pairStatus', value) 'Paired' or 'Unpaired'

export async function logout(){
  await clearStorage();
  router.replace("/login");
}