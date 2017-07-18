import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { GlobalConfig } from '../config';
import { ILoginListener } from './login-listener';

import * as BasicAuthorizationHeader from 'basic-authorization-header';
import { LoggingService } from './logging.service';
import { NativeStorageService } from './native-storage.service';

@Injectable()
export class AuthService {
  private _userId: string = null;
  private _password: string = null;
  private _listeners = new Array<ILoginListener>();

  constructor(private _http: Http,
              private _log: LoggingService,
              private _nativeStorage: NativeStorageService) { }

  public addListener(listener: ILoginListener) {
    this._listeners.push(listener);
    if (this._userId) {
      listener.onSuccessfulLogin(this._userId);
    }
  }

  public removeListener(listener: ILoginListener) {
    this._listeners = this._listeners.filter((elt) => elt != listener);
  }

  public getUserId(): string {
    return this._userId;
  }

  public async tryLoginAndGetViewmodel(loginOrUserId: string, password: string): Promise<any> {
    const fullUrl = GlobalConfig.getViewmodelBaseUrl + '/' + loginOrUserId + '?type=mobile';
    const response = await this._http.get(fullUrl,
      this.getRequestOptionsWithCredentials(loginOrUserId, password)).toPromise();
    await this._saveCredentials(response.json().id, password);
    return response.json().viewModel;
  }

  public async checkExistingCredentials() {
    const userId = await this._nativeStorage.getItem('userid');
    const password = await this._nativeStorage.getItem('password');
    await this._saveCredentials(userId, password);
  }

  public async logout() {
    await this._nativeStorage.remove('userid');
    await this._nativeStorage.remove('password');
    for (const listener of this._listeners) {
      listener.onLogout();
    }
    this._userId = null;
    this._password = null;
  }

  public getRequestOptionsWithSavedCredentials(): RequestOptionsArgs {
    return this.getRequestOptionsWithCredentials(this._userId, this._password);
  }

  private async _saveCredentials(userId: string, password: string) {
    this._userId = userId;
    this._password = password;
    await this._nativeStorage.setItem('userid', userId);
    await this._nativeStorage.setItem('password', password);
    this.notifyListenersOnLogin();
  }

  private notifyListenersOnLogin() {
    for (const listener of this._listeners) {
      listener.onSuccessfulLogin(this._userId);
    }
  }

  private getRequestOptionsWithCredentials(userId: string, password: string): RequestOptionsArgs {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': BasicAuthorizationHeader(userId, password),
      }),
    };
  }
}
