import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";
import { NativeStorage } from 'ionic-native';
import { DbConnectionService } from "./db-connection.service";

@Injectable()
export class AuthService {
  private _username: string = null;
  private _sid: string = null;

  constructor(private _backendService: BackendService,
              private _dbConnectionService: DbConnectionService) {}

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
        this._sid = sid;
        return NativeStorage.getItem('username');
      }).then((username: string) => {
        this._username = username;
        this._dbConnectionService.onSuccessfulLogin(username, this._sid);
      });
  }

  private _saveCredentials(sid: string, username: string) {
    this._username = username;
    this._dbConnectionService.onSuccessfulLogin(username, sid);
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
    this._dbConnectionService.onLogout();
    this._username = null;
    this._sid = null;
  }
}