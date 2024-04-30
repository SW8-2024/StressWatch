import {storeString, getString, clearStorage} from '@/helpers/AsyncStorage';
import { router } from 'expo-router';
//To test locally run backend locally and use something like ngrok to connect on phone
//ngrok http --domain=emerging-teaching-stag.ngrok-free.app 2345
const serverLocation = 'https://emerging-teaching-stag.ngrok-free.app/';

export async function sendUsageData(data : EventUsageTransformedData[]) {  
  let url : string = serverLocation + "api/DataCollection/app-usage";  
  let res : boolean = false;
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized){
    console.log("Not authorized to sendUsageData")
    await refreshAuthorization();
  }
  else{    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(data),
    })
    .then((response : Response) => {
      if (response.status == 200){res = true;}
    })
    .catch((error : any) => console.log("Error: " + error));
  }
  return res;
}

export async function receiveUsageData(){
  let res = [];
  let url : string = serverLocation + "api/DataCollection/app-usage";  
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized){
    console.log("Not authorized to receiveUsageData")
    await refreshAuthorization();
  }
  else{
    res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'accept': '*/*',
        'Authorization': 'Bearer ' + accessToken
      },      
    })
    .then((response : Response) => {
      if (response.status == 200){
        return response.json();
      }else{
        return [];
      }
    })
    .catch((error : any) => console.log("Error: " + error));
  }
  return res;
}
export async function register(email : string, password : string) : Promise<any>{
  let url = serverLocation + "register";
  let ret : any = new Response();
  await fetch(url, {
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
  .then((response : Response) => {    
    if (response.status == 200){
      ret = response;
      return undefined;
    }
    else {
      return response.json()
    } 
  })
  .then((possibleObj : any) => {
      if (possibleObj != undefined){
        ret = possibleObj;
      }
      
  })
  .catch((error : any) => console.log("Error: " + error));
  return ret;
}

async function checkIfAuthorized() : Promise<[boolean, string]>{
  let authorized = false;
  let accessToken = "";
  await Promise.all(
    [getString("accessToken"),
    getString("authorizedUntil"),
    ]).then((values : any []) => {
    accessToken = values[0];
    let authorizedUntil = values[1];
    if (typeof(accessToken) == "string" && typeof(authorizedUntil) == "string" && parseInt(authorizedUntil) > Date.now()){      
      authorized = true;
    }
  })
  .catch(() => {return;});
  return [authorized,accessToken];
}

export async function login(email : string, password : string){
  let url = serverLocation + "login";
  let ret = false;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',      
    },
    body: JSON.stringify({
            "email": email,
            "password": password                
    }),
  })
  .then((response : Response) => {
    if (response.status == 200){ret = true;};
    return response.json();
  })
  .then(async (resp : any) => {
    if (ret){      
      await Promise.all([storeString("accessToken", resp.accessToken),
        storeString("refreshToken", resp.refreshToken),
        storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString())])
    }
  })
  .catch((error : any) => console.log("Error: " + error));
  return ret;
}

export async function refreshAuthorization() : Promise<boolean>{
  let url = serverLocation + "refresh";
  let success = false;

  let authorizedUntil = await getString("authorizedUntil");
  if (authorizedUntil == null || authorizedUntil == undefined || parseInt(authorizedUntil) < Date.now()){
    console.log("Cannot refresh authorization");
    return success;
  }

  let refreshToken = await getString("refreshToken");
  if (refreshToken == null || refreshToken == undefined){
    return false;
  };
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({            
            "refreshToken": refreshToken,
    }),
  })
  .then((response : Response) => {
    if (response.status == 200){success = true;};
    return response.json();;
  })
  .then((resp : any) => {
    storeString("accessToken", resp.accessToken);
    storeString("refreshToken", resp.refreshToken);
    storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());  
  })
  .catch((error : any) => console.log("Error: " + error));
  return success;
}

export async function logout(){
  await clearStorage();
  router.replace("/login");
}