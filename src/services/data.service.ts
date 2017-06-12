import { Injectable } from '@angular/core'
import { FirebaseService } from './firebase.service';
import { BackendService } from "./backend.service";

import { DbConnectionService } from "./db-connection.service";
import { Observable } from "rxjs/Rx";
import { LoggingService } from "./logging.service";
import { MonotonicTimeService } from "./monotonic-time.service";
import { AuthService } from "./auth.service";
import { LoginListener } from "./login-listener";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class DataService implements LoginListener {
  private _refreshModelUpdateSubscription: Subscription = null;

  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService,
    private _backendService: BackendService,
    private _dbConnectionService: DbConnectionService,
    private _logging: LoggingService,
    private _time: MonotonicTimeService,
    private _authService: AuthService) {

    this._authService.addListener(this);
  }

  public onSuccessfulLogin(username: string) {
    // TODO: adjust event frequency
    this._refreshModelUpdateSubscription = Observable.timer(0, 10000).subscribe(() => this.pushRefreshModelEvent());
  }
  public onLogout() {
    if (this._refreshModelUpdateSubscription) {
      this._refreshModelUpdateSubscription.unsubscribe();
      this._refreshModelUpdateSubscription = null;
    }
  }

  public getData(): Observable<any> {
    let dummyData: Observable<any> = Observable.of({ pages: [{ pageType: "plain_test", menuTitle: "" }] });

    let existingData: Observable<any> = Observable.fromPromise(
      this._dbConnectionService.getViewModelDb().get(this._authService.getUsername()))

    let futureUpdates: Observable<any> = Observable.create(observer => {
      let changesStream = this._dbConnectionService.getViewModelDb().changes(
        { live: true, since: 'now', include_docs: true, doc_ids: [this._authService.getUsername()] });
      changesStream.on('change', change => {
        this._logging.debug("Received page update: " + JSON.stringify(change));
        observer.next(change.doc);
      });
      return () => { changesStream.cancel(); }
    });
    // It's possible that we don't have proper data on device yet (first login),
    // so we need to skip an error and wait until synchronization.
    return existingData.catch(() => dummyData).concat(futureUpdates);
  }

  public pushEvent(eventType: string, data: any) {
    const currentTimestamp = this._time.getUnixTimeMs();
    this._dbConnectionService.getEventsDb().post({
      characterId: this._authService.getUsername(),
      timestamp: currentTimestamp,
      eventType: eventType,
      data: data
    })
      .then(response => this.pushRefreshModelEvent())
      .then(response => this._logging.debug(JSON.stringify(response)))
      .catch(err => this._logging.debug(JSON.stringify(err)))
  }

  public pushRefreshModelEvent():  Promise<PouchDB.Core.Response> {
    return this._dbConnectionService.getEventsDb().post({
      characterId: this._authService.getUsername(),
      timestamp: this._time.getUnixTimeMs(),
      eventType: '_RefreshModel',
      data: {}
    });
  }
}
