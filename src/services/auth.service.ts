import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";
import { NativeStorage } from 'ionic-native';
import { LoginListener } from "./login-listener";

@Injectable()
export class AuthService {
  private _username: string = null;
  private _listeners = new Array<LoginListener>();

  constructor(private _backendService: BackendService) {}

  public addListener(listener: LoginListener) {
    this._listeners.push(listener);
    if (this._username)
      listener.onSuccessfulLogin(this._username);
  }

  public getUsername(): string {
    return this._username;
  }

  public login(username: string, password: string): Promise<void> {
    return this._backendService.auth(username, password)
      .then((sid: string) => {
        this._saveCredentials(sid, username);
        return;
      });
  }

  public checkAuthentication(): Promise<void> {
    return NativeStorage.getItem('sid')
      .then((sid: string) => {
        return NativeStorage.getItem('username');
      }).then((username: string) => {
        this._username = username;
        this.notifyListenersOnLogin();
      });
  }

  private _saveCredentials(sid: string, username: string) {
    this._username = username;
    this.notifyListenersOnLogin();
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
    for (let listener of this._listeners)
      listener.onLogout();
    this._username = null;
  }

  private notifyListenersOnLogin() {
    for (let listener of this._listeners)
      listener.onSuccessfulLogin(this._username);
  }
}