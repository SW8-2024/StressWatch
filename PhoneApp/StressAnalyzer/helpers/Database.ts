import { storeString, getString, clearStorage } from '@/helpers/AsyncStorage';
import { router } from 'expo-router';
//To test locally run backend locally and use something like ngrok to connect on phone
//ngrok http --domain=emerging-teaching-stag.ngrok-free.app 2345
const serverLocation = 'https://127.0.0.1/';

async function fetchWithAuth(url: string, options?: RequestInit | undefined): Promise<Response> {
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized) {
    console.log("Not authorized to sendUsageData")
    await refreshAuthorization();
  }

  [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized) {
    throw new Error("Could not obtain a valid accessToken");
  }

  options = options ?? {};
  options.headers = (options.headers ?? {});
  let value = "Bearer " + accessToken;
  if (options.headers instanceof Headers)
    options.headers.append("Authorization", value);
  else if (options.headers instanceof Array)
    options.headers.push(["Authorization", value]);
  else
    options.headers["Authorization"] = value;
  return fetch(url, options); ``
}

export interface StressByApp {
  appName: string;
  value: number;
}

export interface StressDataPoint {
  date: Date;
  value: number;
}

export interface BreakDownData {
  stressAverage: number;
  dailyStressDataPoints: StressDataPoint[];
  stressByApp: StressByApp[];
}

export async function getBreakdown(date: Date): Promise<BreakDownData> {
  const url: string = serverLocation + "api/DataCollection/breakdown";
  const response: Response = await fetchWithAuth(url);
  if (response.status != 200) {
    throw new Error(`Got status ${response.status} while trying to get breakdown`)
  }
  return await response.json();
}

export async function sendUsageData(data: EventUsageTransformedData[]) {
  const url: string = serverLocation + "api/DataCollection/app-usage";
  let response: Response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify(data),
  })
  return response.status == 200;
}

export async function receiveUsageData() {
  const url: string = serverLocation + "api/DataCollection/app-usage";
  let response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (response.status == 200) {
    return (await response.json()) as AppUsageResponse[];
  } else {
    throw new Error("Got status " + response.status + " while trying to get usage data");
  }
}
export async function register(email: string, password: string): Promise<any> {
  let url = serverLocation + "register";
  let ret: any = new Response();
  let response: Response = await fetch(url, {
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
  if (response.status == 200) {
    ret = response;
  } else {
    ret = response.json();
  }
  return ret;
}

async function checkIfAuthorized(): Promise<[boolean, string]> {
  let authorized = false;
  let accessToken = await getString("accessToken");
  let authorizedUntil = await getString("authorizedUntil");
  if (typeof (accessToken) == "string") {
    if (typeof (authorizedUntil) == "string" && parseInt(authorizedUntil) > Date.now()) {
      authorized = true;
    }
  } else {
    accessToken = "";
  }
  return [authorized, accessToken];
}

export async function login(email: string, password: string) {
  let url = serverLocation + "login";
  let ret = false;
  try {
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
    if (response.status == 200) {
      ret = true;
      let resp = await response.json();
      await storeString("accessToken", resp.accessToken);
      await storeString("refreshToken", resp.refreshToken);
      await storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());
    }
  } catch (e) {
    console.log("Error: " + e);
    return false;
  }
  return ret;
}

export async function refreshAuthorization(): Promise<boolean> {
  let url = serverLocation + "refresh";
  let ret = false;

  let authorizedUntil = await getString("authorizedUntil");
  if (authorizedUntil == null || authorizedUntil == undefined || parseInt(authorizedUntil) < Date.now()) {
    console.log("Cannot refresh authorization");
    return ret;
  }

  let refreshToken = await getString("refreshToken");
  if (refreshToken == null || refreshToken == undefined) {
    return false;
  };
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "refreshToken": refreshToken,
      }),
    });
    if (response.status == 200) {
      ret = true;
      let resp = await response.json();
      await storeString("accessToken", resp.accessToken);
      await storeString("refreshToken", resp.refreshToken);
      await storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());
    }
  } catch (e) {
    console.log("Error: " + e);
    return false;
  }
  return ret;
}

export async function logout() {
  await clearStorage();
  router.replace("/login");
}