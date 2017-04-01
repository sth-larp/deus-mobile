import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Http } from "@angular/http";
import { NativeStorage } from 'ionic-native';
import { FirebaseService } from './firebase.service';
import { BackendService } from "./backend.service";
import { Observable } from "rxjs/Rx";


@Injectable()
export class DataService {
  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService,
    private _backendService: BackendService,
    private _httpRemoveMe: Http) { }

  public getData(): Observable<any> {
    return this._httpRemoveMe.get('assets/example-responses/pages.json')
      .map(response => response.json());
  }

  public checkAccessRights(area_id: string): Promise<boolean> {
    // TODO: query server
    return new Promise((resolve) => setTimeout(() => resolve(area_id != "SuperPrivate"), 3000));
  }

  public getSid(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('sid'));
  }

  public getUsername(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('username'));
  }

  public login(username: string, password: string): Observable<boolean> {
    return this._backendService.auth(username, password)
      .map((sid: string) => {
        if (sid) {
          this._saveCredentials(sid, username);
          return true;
        }
        return false;
      });
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
    this._backendService.setSid(null);
  }

  private _saveCredentials(sid: string, username: string) {
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
    this._backendService.setSid(sid);
  }
}
