/**
 * @modul6e Services
 */
import { AuthService } from './auth';
declare var firebase;
export class APIService {
  host: string;
  shouldBeAsync = true;
  apiKey: string;
  auth: AuthService;
  tokenLocalStorageKey: string;

  constructor(
    options: {
      host: string;
      auth?: AuthService;
      tokenLocalStorageKey?: string;
    } = { host: null, tokenLocalStorageKey: 'api:token' }
  ) {
    this.host = options.host;
    this.auth = options.auth;
    this.tokenLocalStorageKey = options.tokenLocalStorageKey;
  }

  async makePromise(method: string, endpoint: string, params?: any) {
    return new Promise(async (resolve, reject) => {
      const request = new XMLHttpRequest();
      let token;
      if (this.auth) {
        token = firebase.auth().currentUser
          ? await firebase.auth().currentUser.getIdToken(true)
          : localStorage.getItem(this.tokenLocalStorageKey);
      }
      request.onload = async () => {
        const responseData: any = JSON.parse(request.responseText);
        if (responseData && responseData.data && responseData.success) {
          if (this.auth) {
            localStorage.setItem(
              this.tokenLocalStorageKey,
              await firebase.auth().currentUser.getIdToken(true)
            );
          }
          resolve(responseData.data);
        } else {
          reject(responseData);
        }
      };

      let queryParameters;
      if (method === 'GET' && params) {
        queryParameters = (await Promise.all(
          Object.keys(params).map(key => key + '=' + params[key])
        )).join('&');
      }

      request.open(
        method,
        `${this.host}/${
          method === 'GET' && params
            ? endpoint + '?' + queryParameters
            : endpoint
        }`,
        this.shouldBeAsync
      );

      request.setRequestHeader(
        'Content-Type',
        'application/json;charset=UTF-8'
      );
      if (this.auth && token) {
        request.setRequestHeader('Authorization', token);
      }

      request.send(params ? JSON.stringify(params) : '{}');
    });
  }

  get(endpoint: string, params?: any): Promise<any> {
    return this.makePromise('GET', endpoint, params);
  }

  post(endpoint: string, params?: any): Promise<any> {

    return this.makePromise('POST', endpoint, params);
  }

  delete(endpoint: string, params?: any): Promise<any> {
    return this.makePromise('DELETE', endpoint, params);
  }
}
