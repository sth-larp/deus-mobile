import { Injectable } from "@angular/core";
import { NativeStorage } from 'ionic-native';
import { LoginListener } from "./login-listener";
import { Headers, RequestOptionsArgs, Http } from "@angular/http";
import { GlobalConfig } from "../config";

import * as BasicAuthorizationHeader from 'basic-authorization-header'
import { LoggingService } from "./logging.service";

@Injectable()
export class AuthService {
  private _username: string = null;
  private _password: string = null;
  private _listeners = new Array<LoginListener>();

  constructor(private _http: Http,
              private _log: LoggingService) { }

  public addListener(listener: LoginListener) {
    this._listeners.push(listener);
    if (this._username) {
      this._log.debug(`Adding listener ${listener.constructor.name}, already logged in`);
      listener.onSuccessfulLogin(this._username);
    }
    else {
      this._log.debug(`Adding listener ${listener.constructor.name}, not logged in`);
    }
    this._log.debug(`There is ${this._listeners.length} listeners`);
  }

  public getUsername(): string {
    return this._username;
  }

  public async tryLoginAndGetViewmodel(username: string, password: string): Promise<any> {
    const fullUrl = GlobalConfig.getViewmodelBaseUrl + '/' + username + '?type=mobile';
    const response = await this._http.get(fullUrl,
      this.getRequestOptionsWithCredentials(username, password)).toPromise();
    this._saveCredentials(username, password);
    return response.json().viewModel;
  }

  public async checkExistingCredentials() {
    this._log.debug(`There is ${this._listeners.length} listeners`);
    this._log.debug('checkExistingCredentials - begin');
    const username = await NativeStorage.getItem('username');
    const password = await NativeStorage.getItem('password');
    await this._saveCredentials(username, password);
    this._log.debug('checkExistingCredentials - end');
    this._log.debug(`There is ${this._listeners.length} listeners`);
  }

  private async _saveCredentials(username: string, password: string) {
    this._log.debug(`There is ${this._listeners.length} listeners`);
    this._log.debug('_saveCredentials - begin');
    this._username = username;
    this._password = password;
    await NativeStorage.setItem('username', username);
    await NativeStorage.setItem('password', password);
    this.notifyListenersOnLogin();
    this._log.debug('_saveCredentials - end');
    this._log.debug(`There is ${this._listeners.length} listeners`);
  }

  public async logout() {
    this._log.debug(`There is ${this._listeners.length} listeners`);
    this._log.debug('logout - begin');
    await NativeStorage.remove('username');
    await NativeStorage.remove('password');
    for (let listener of this._listeners) {
      this._log.debug('Notify about logout: ' + listener.constructor.name);
      listener.onLogout();
    }
    this._username = null;
    this._password = null;
    this._log.debug('logout - end');
    this._log.debug(`There is ${this._listeners.length} listeners`);
  }

  private notifyListenersOnLogin() {
    this._log.debug(`There is ${this._listeners.length} listeners`);
    for (let listener of this._listeners) {
      this._log.debug('Notify about login: ' + listener.constructor.name);
      listener.onSuccessfulLogin(this._username);
    }
    this._log.debug(`There is ${this._listeners.length} listeners`);
  }

  public getRequestOptionsWithSavedCredentials(): RequestOptionsArgs {
    return this.getRequestOptionsWithCredentials(this._username, this._password);
  }

  private getRequestOptionsWithCredentials(username: string, password: string): RequestOptionsArgs {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': BasicAuthorizationHeader(username, password),
      })
    };
  }
}