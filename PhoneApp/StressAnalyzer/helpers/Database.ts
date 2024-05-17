import { storeString, getString, clearStorage } from '@/helpers/AsyncStorage';
import { router } from 'expo-router';
//To test locally run backend locally and use something like ngrok to connect on phone
//ngrok http --domain=emerging-teaching-stag.ngrok-free.app 2345
//Or alternatively 'http://10.0.2.2:5093/' if you are cool
const serverLocation = 'https://chillchaser.ovh/';

async function fetchWithAuth(url: string, options?: RequestInit | undefined): Promise<Response> {
  let [authorized, accessToken] = await checkIfAuthorized();
  if (!authorized) {
    console.log("Not authorized to fetch with auth")
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

export async function getAppAnalysisPerDayByApp(date: Date, packageName: string): Promise<RemoteAppAnalysisByDateData> {
  const endpointUrl: string = serverLocation + "api/DataAnalysis/per-app-per-day-usage-analysis";
  const response: Response = await fetchWithAuth(`${endpointUrl}?endOfDay=${date.toISOString()}&appName=${packageName}`);
  if (response.status != 200) {
    console.log(response);
    throw new Error(`Got status ${response.status} while trying to get appAnalaysisPerDateByApp`)
  }
  return await response.json();
}

export async function getAppAnalysisByDayByApp(date: Date, packageName: string): Promise<RemoteAnalysisForDayAndAppResponse> {
  const endpointUrl: string = serverLocation + "api/DataAnalysis/analysis-for-day-and-app";
  const response: Response = await fetchWithAuth(`${endpointUrl}?endOfDay=${date.toISOString()}&appName=${packageName}`);
  if (response.status != 200) {
    throw new Error(`Got status ${response.status} while trying to get appAnalaysisByDateByApp`)
  }
  return await response.json();
}

export async function getBreakdown(date: Date): Promise<RemoteBreakDownData> {
  const endpointUrl: string = serverLocation + "api/DataAnalysis/breakdown";
  const response: Response = await fetchWithAuth(`${endpointUrl}?date=${date.toISOString()}`);
  if (response.status != 200) {
    throw new Error(`Got status ${response.status} while trying to get breakdown`)
  }

  return await response.json();
}


export async function getAppAnalysis(): Promise<RemoteAppAnalysisData> {
  const endpointUrl: string = serverLocation + "api/DataAnalysis/app-breakdown";
  const response: Response = await fetchWithAuth(endpointUrl);
  if (response.status != 200) {
    throw new Error(`Got status ${response.status} while trying to get app-breakdown`);
  }

  return await response.json();
}

export async function getStressMetrics(date: Date): Promise<StressMetrics> {
  const endpointUrl: string = serverLocation + "api/DataAnalysis/stress-metrics";
  const response: Response = await fetchWithAuth(`${endpointUrl}?date=${date.toISOString()}`);
  if (response.status != 200) {
    throw new Error(`Got status ${response.status} while trying to get breakdown`)
  }

  return await response.json();
}

export async function sendUsageData(data: EventUsageTransformedData[]) {
  console.log("Getting usage data")
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

export async function authorize(token: string): Promise<string> {
  const url: string = serverLocation + "api/Watch/authorize";
  let response: Response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    },
    body: JSON.stringify({
      "token": token
    }),
  })

  if (response.status == 200){
    return `${response.status} Authorized`;
  } else {
    return `${response.status} ${((await response.text()).replaceAll('"', ' '))}`;
  }
}

export async function refreshAuthorization(): Promise<boolean> {
  let url = serverLocation + "refresh";

  let authorizedUntil = await getString("authorizedUntil");
  if (authorizedUntil == null || authorizedUntil == undefined || parseInt(authorizedUntil) < Date.now()) {
    console.log("Cannot refresh authorization");
    return false;
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
    if (response.status != 200) {
      return false;
    }
    let resp = await response.json();
    await storeString("accessToken", resp.accessToken);
    await storeString("refreshToken", resp.refreshToken);
    await storeString("authorizedUntil", (Date.now() + resp.expiresIn * 1000).toString());
    return true;
  } catch (e) {
    console.log("Error: " + e);
    return false;
  }
}

export async function logout() {
  await clearStorage();
  router.replace("/login/login");
}