import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { GlobalConfig } from '../config';
import { ILoginListener } from './login-listener';

import * as BasicAuthorizationHeader from 'basic-authorization-header';
import { LoggingService } from './logging.service';
import { NativeStorageService } from './native-storage.service';

@Injectable()
export class AuthService {
  private _username: string = null;
  private _password: string = null;
  private _listeners = new Array<ILoginListener>();

  constructor(private _http: Http,
              private _log: LoggingService,
              private _nativeStorage: NativeStorageService) { }

  public addListener(listener: ILoginListener) {
    this._listeners.push(listener);
    if (this._username) {
      listener.onSuccessfulLogin(this._username);
    }
  }

  public removeListener(listener: ILoginListener) {
    this._listeners = this._listeners.filter((elt) => elt != listener);
  }

  public getUsername(): string {
    return this._username;
  }

  public async tryLoginAndGetViewmodel(username: string, password: string): Promise<any> {
    const fullUrl = GlobalConfig.getViewmodelBaseUrl + '/' + username + '?type=mobile';
    const response = await this._http.get(fullUrl,
      this.getRequestOptionsWithCredentials(username, password)).toPromise();
    await this._saveCredentials(username, password);
    return response.json().viewModel;
  }

  public async checkExistingCredentials() {
    const username = await this._nativeStorage.getItem('username');
    const password = await this._nativeStorage.getItem('password');
    await this._saveCredentials(username, password);
  }

  public async logout() {
    await this._nativeStorage.remove('username');
    await this._nativeStorage.remove('password');
    for (const listener of this._listeners) {
      listener.onLogout();
    }
    this._username = null;
    this._password = null;
  }

  public getRequestOptionsWithSavedCredentials(): RequestOptionsArgs {
    return this.getRequestOptionsWithCredentials(this._username, this._password);
  }

  private async _saveCredentials(username: string, password: string) {
    this._username = username;
    this._password = password;
    await this._nativeStorage.setItem('username', username);
    await this._nativeStorage.setItem('password', password);
    this.notifyListenersOnLogin();
  }

  private notifyListenersOnLogin() {
    for (const listener of this._listeners) {
      listener.onSuccessfulLogin(this._username);
    }
  }

  private getRequestOptionsWithCredentials(username: string, password: string): RequestOptionsArgs {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': BasicAuthorizationHeader(username, password),
      }),
    };
  }
}
