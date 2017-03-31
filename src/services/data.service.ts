import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Http } from "@angular/http";
import { NativeStorage } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { FirebaseService } from './firebase.service';


@Injectable()
export class DataService {
  private _root_url: string = 'http://dev.alice.digital/api-mock/master';
  private _json_request_opts: RequestOptionsArgs = {
    headers: (() => {
      let h = new Headers();
      h.append('Content-Type', 'application/json');
      h.append('Accept', 'application/json');
      return h;
    })()
  };

  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService, private _http: Http) { }

  public getData(): Observable<any> {
    return this._http.get('assets/example-responses/pages.json')
      .map(response => response.json());
  }

  public getSid(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('sid'));
  }
  public getUsername(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('username'));
  }

  public login(username: string, password: string): Observable<boolean> {
    let login_payload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._root_url + '/auth', login_payload, this._json_request_opts)
      .map((response: any) => {
        if (response && response.json() && response.json()['sid']) {
          console.log("Successful login!");
          this._setCredentials(response.json()['sid'], username);
          return true;
        }
        return false;
      });
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
  }

  private _setCredentials(sid: string, username: string) {
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
  }

  public checkAccessRights(area_id: string): Promise<boolean> {
    // TODO: query server
    return new Promise((resolve) => setTimeout(() => resolve(area_id != "SuperPrivate"), 3000));
  }
}
