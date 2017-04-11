import { Injectable } from '@angular/core'
import { NativeStorage } from 'ionic-native';
import { FirebaseService } from './firebase.service';
import { BackendService } from "./backend.service";

import { DbConnectionService } from "./db-connection.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class DataService {
  private _username: string = null;
  private _sid: string = null;

  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService,
    private _backendService: BackendService,
    private _dbConnectionService: DbConnectionService) {
  }

  public getData(): Observable<any> {
    let existingData: Observable<any> = Observable.from(
      // TODO: provide proper query
      this._dbConnectionService.pagesDb.allDocs({ include_docs: true, limit: 1 })
        .then(
        docs => {
          if (!docs.rows.length) return { pages: {} };
          return docs.rows[0].doc;
        }));

    let futureUpdates: Observable<any> = Observable.create(observer => {
      // Listen for changes on the database.
      let changesStream = this._dbConnectionService.pagesDb.changes({ live: true, since: 'now', include_docs: true });
      changesStream.on('change', change => {
        console.log(JSON.stringify(change));
        observer.next(change.doc);
      });
      return () => { changesStream.cancel(); }
    });
    return existingData.concat(futureUpdates);
  }

  public pushEvent() {
    this._dbConnectionService.eventsDb.post({ "hello": "world", "character": this._username })
      .then(response => console.log(JSON.stringify(response)))
      .catch(err => console.log(JSON.stringify(err)))
  }

  public checkAccessRights(areaId: string): Promise<boolean> {
    // TODO: query server
    return new Promise((resolve) => setTimeout(() => resolve(areaId != "SuperPrivate"), 3000));
  }

  public getUsername(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('username'));
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
        this._dbConnectionService.onLogin(username);
      });
  }

  private _saveCredentials(sid: string, username: string) {
    this._username = username;
    this._backendService.setSid(sid);
    this._dbConnectionService.onLogin(username);
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
    this._backendService.setSid(null);
    this._dbConnectionService.onLogout();
    this._username = null;
    this._sid = null;
  }
}
