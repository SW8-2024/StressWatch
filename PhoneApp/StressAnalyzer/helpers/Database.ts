import {storeString, getString, clearStorage} from '@/helpers/AsyncStorage';
import { Redirect } from 'expo-router';
import { router } from 'expo-router';
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
      // body: JSON.stringify(data),
      body:JSON.stringify({
        "from": "2024-04-19T11:15:24.980Z",
        "to": "2024-04-19T11:15:24.980Z",
        "appName": "string"
      })
    })
    .then((response : Response) => {
      if (response.status == 200){res = true;}
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
  // 'grant_type=refresh_token&refresh_token='+token
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
export async function test(){
  while (!(await checkIfAuthorized())){

  }
  console.log("Usage data return: " + await sendUsageData([]));
  
}