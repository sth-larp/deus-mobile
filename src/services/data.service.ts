import * as PouchDB from 'pouchdb';

import { Injectable } from '@angular/core'
import { Observable } from "rxjs/Rx";

import { LoggingService } from "./logging.service";
import { MonotonicTimeService } from "./monotonic-time.service";
import { AuthService } from "./auth.service";
import { LoginListener } from "./login-listener";
import { Subscription } from "rxjs/Subscription";
import { Http } from "@angular/http";
import { GlobalConfig } from "../config";
import { upsert } from "../utils/pouchdb-utils";

export enum UpdateStatus {
  Green,
  Yellow,
  Red
}

@Injectable()
export class DataService implements LoginListener {
  private _refreshModelUpdateSubscription: Subscription = null;
  private _eventsDb: PouchDB.Database<{ eventType: string; data: any; }> = null;
  private _viewModelDb: PouchDB.Database<{ timestamp: number }> = null;

  constructor(private _logging: LoggingService,
    private _time: MonotonicTimeService,
    private _authService: AuthService,
    private _http: Http) {

    this._authService.addListener(this);
  }
  public onSuccessfulLogin(username: string) {
    // TODO: adjust event frequency
    // this._refreshModelUpdateSubscription = Observable.timer(0, 20000).subscribe(() => this.trySendEvents());
    this._eventsDb = new PouchDB(username + '_events');
    this._viewModelDb = new PouchDB(username + '_viewmodel');
  }

  public onLogout() {
    if (this._eventsDb) {
      this._eventsDb.close();
      this._eventsDb = null;
    }
    if (this._viewModelDb) {
      this._viewModelDb.close();
      this._viewModelDb = null;
    }
    if (this._refreshModelUpdateSubscription) {
      this._refreshModelUpdateSubscription.unsubscribe();
      this._refreshModelUpdateSubscription = null;
    }
  }

  public getData(): Observable<any> {
    let existingData: Observable<any> = Observable.fromPromise(
      this._viewModelDb.get(this._authService.getUsername()))

    let futureUpdates: Observable<any> = Observable.create(observer => {
      let changesStream = this._viewModelDb.changes(
        { live: true, include_docs: true, doc_ids: [this._authService.getUsername()] });
      changesStream.on('change', change => {
        this._logging.debug("Received page update: " + JSON.stringify(change));
        observer.next(change.doc);
      });
      return () => { changesStream.cancel(); }
    });
    return existingData.onErrorResumeNext(futureUpdates);
  }

  public getCurrentData(): Promise<any> {
    return this._viewModelDb.get(this._authService.getUsername());
  }

  public getUpdateStatus(): Observable<UpdateStatus> {
    return Observable.create(observer => {
      let lastUpdateTime = 0;
      let changesStream = this._viewModelDb.changes(
        { live: true, since: 'now', include_docs: true, doc_ids: [this._authService.getUsername()] });
      changesStream.on('change', change => lastUpdateTime = change.doc.timestamp);

      let subscription = Observable.timer(0, GlobalConfig.recalculateUpdateStatusEveryMs)
        .map(() => {
          const currentTimestamp = this._time.getUnixTimeMs();
          const viewModelLagTimeMs = currentTimestamp - lastUpdateTime;
          if (viewModelLagTimeMs < GlobalConfig.viewModelLagTimeMsYellowStatus)
            observer.next(UpdateStatus.Green);
          else if (viewModelLagTimeMs < GlobalConfig.viewModelLagTimeMsRedStatus)
            observer.next(UpdateStatus.Yellow);
          else
            observer.next(UpdateStatus.Red);
        }).subscribe();

      return () => {
        changesStream.cancel();
        if (subscription) subscription.unsubscribe();
      }
    });
  }

  public pushEvent(eventType: string, data: any) {
    this._eventsDb.put({
      _id: this._time.getUnixTimeMs().toString(),
      eventType: eventType,
      data: data
    })
      .then(response => this.trySendEvents())
      .then(response => this._logging.debug(JSON.stringify(response)))
      .catch(err => this._logging.debug(JSON.stringify(err)))
  }

  private pushRefreshModelEvent(): Promise<PouchDB.Core.Response> {
    return this._eventsDb.put(this.makeRefreshModelEvent());
  }

  private makeRefreshModelEvent() {
    return {
      _id: this._time.getUnixTimeMs().toString(),
      characterId: this._authService.getUsername(),
      eventType: '_RefreshModel',
      data: {}
    }
  }

  public async trySendEvents() {
    console.debug("Trying to send events to server");
    await this.pushRefreshModelEvent();
    const alldocsResponse = await this._eventsDb.allDocs({ include_docs: true });
    const events = alldocsResponse.rows.map(row => {
      return {
        timestamp: Number(row.doc._id),
        characterId: this._authService.getUsername(),
        eventType: row.doc.eventType,
        data: row.doc.data
      }
    });
    console.info(`Sending ${events.length} events to server`);
    console.debug(JSON.stringify(events));
    const requestBody = JSON.stringify({ events: events });
    const fullUrl = GlobalConfig.sendEventsBaseUrl + '/' + this._authService.getUsername();
    try {
      const response = await this._http.post(fullUrl, requestBody,
        this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
      if (response.status == 200) {
        console.debug("Get updated viewmodel! :)");
        let updatedViewModel = response.json().viewModel;
        await this.deleteEventsBefore(updatedViewModel.timestamp);
        await this.setViewModel(updatedViewModel);
      }
      else if (response.status == 202) {
        console.warn("Managed to submit events, but no viewmodel :(");
        await this.deleteEventsBefore(response.json().timestamp);
      } else
        throw response.toString();
    }
    catch (e) {
      if (e.status && (e.status == 401 || e.status == 404))
        await this._authService.logout();
    }
  }

  public async setViewModel(viewModel: any) {
    viewModel._id = this._authService.getUsername();
    upsert(this._viewModelDb, viewModel);
  }

  private async deleteEventsBefore(timestamp: number) {
    console.info(`deleting events before ${timestamp}`);
    const alldocsBeforeResponse = await this._eventsDb.allDocs({
      include_docs: true,
      startkey: "0",
      endkey: timestamp.toString()
    });

    await Promise.all(alldocsBeforeResponse.rows.map(row => this._eventsDb.remove(row.doc._id, row.value.rev)));
  }
}
