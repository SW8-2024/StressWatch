import { http, HttpResponse, JsonBodyType, PathParams } from 'msw'
import { setupServer } from 'msw/node'
let userDatabase = new Map<string,string>();

const authToken = "fpojfoidsjfFFunfd41259" + Math.floor(Math.random() * 1000);
const refreshToken = "oaksdjsaijsgfoij21" + Math.floor(Math.random() * 1000);
const serverLocation = 'https://chillchaser.ovh/';

type registerRequestBody = {
  email: string,
  password: string
}

type refreshBody = {
  refreshToken: string,
}

type loginResponse = {
  tokenType: string,
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
} | any;

export const server = setupServer(
  http.post<PathParams, registerRequestBody, JsonBodyType, string>(serverLocation +  'register', async ({ request }) => {    
    const body = await request.json();
    const email = body.email;
    const pass = body.password;
    if (email.includes("@") && pass.match(/[A-Z]/) != null && pass.length > 7){
      userDatabase.set(body.email,body.password);
      return HttpResponse.json(
        {
          status:200,
        },
      );
    }else{
      return HttpResponse.json(
        {
          status: 400,
          title: "One or more validation errors occurred.",
          errors: {
            InvalidEmail: [
              "Invalid email"
            ]
          },
        }
      );
    }    
  }),
  http.post<PathParams, registerRequestBody, loginResponse, string>(serverLocation + 'login', async ({ request }) => {    
    const body = await request.json();
    const pass = userDatabase.get(body.email);
    if (pass != undefined && pass == body.password){      
      return HttpResponse.json(
        {
          "tokenType": "Bearer",
          "accessToken": authToken,
          "expiresIn": 3600,
          "refreshToken": refreshToken,
        },
      )
    }else{
      return new HttpResponse("unauthorized",{
        status: 401,               
      });
    }   
  }),
  http.post<PathParams, refreshBody, loginResponse, string>(serverLocation + 'refresh', async ({ request }) => {
    const body = await request.json();
    if (body.refreshToken == refreshToken){
      return HttpResponse.json(
        {
          "tokenType": "Bearer",
          "accessToken": authToken,
          "expiresIn": 3600,
          "refreshToken": refreshToken,
        },
      )
    }else{
      return new HttpResponse("unauthorized",{
        status: 401,
      });
    }
  }),
)

export const resetServerDb = () => {
  userDatabase.clear();
}