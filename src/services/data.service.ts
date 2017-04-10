import { Injectable } from '@angular/core'
import { NativeStorage } from 'ionic-native';
import { FirebaseService } from './firebase.service';
import { BackendService } from "./backend.service";

import { DbConnectionService } from "./db-connection.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class DataService {
  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService,
    private _backendService: BackendService,
    private _dbConnectionService: DbConnectionService) {
  }

  public getData(): Observable<any> {
    // TODO: just returning Observable with dummy object can be not enough:
    // what if someone subscribed to getData() and then pagesDb was created?
    if (!this._dbConnectionService.pagesDb) return Observable.create({});
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
    this._dbConnectionService.eventsDb.post({ "hello": "world" });
  }

  public checkAccessRights(areaId: string): Promise<boolean> {
    // TODO: query server
    return new Promise((resolve) => setTimeout(() => resolve(areaId != "SuperPrivate"), 3000));
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
    this._dbConnectionService.onLogout();
  }

  private _saveCredentials(sid: string, username: string) {
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
    this._backendService.setSid(sid);
    this._dbConnectionService.onLogin(username);
  }
}
