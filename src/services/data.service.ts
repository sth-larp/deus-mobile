import * as PouchDB from 'pouchdb';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { TypedJSON } from 'typedjson/js/typed-json';

import { EventEmitter } from 'events';
import { GlobalConfig } from '../config';
import { upsert } from '../utils/pouchdb-utils';
import { AuthService } from './auth.service';
import { LoggingService } from './logging.service';
import { ILoginListener } from './login-listener';
import { MonotonicTimeService } from './monotonic-time.service';
import { ApplicationViewModel, ListPageViewModel } from './viewmodel.types';

export enum UpdateStatus {
  Green,
  Yellow,
  Red,
}

@Injectable()
export class DataService implements ILoginListener {
  private _inMemoryViewmodel: ApplicationViewModel = null;

  private _refreshModelUpdateSubscription: Subscription = null;
  private _eventsDb: PouchDB.Database<{ eventType: string; data: any; }> = null;
  private _viewModelDb: PouchDB.Database<ApplicationViewModel> = null;

  private _getDataObservable: Observable<ApplicationViewModel>;

  private _sendEventsLastStatusEmitter = new EventEmitter();

  constructor(private _logging: LoggingService,
              private _time: MonotonicTimeService,
              private _authService: AuthService,
              private _http: Http) {

    this._authService.addListener(this);
  }
  public onSuccessfulLogin(userId: string) {
    this._refreshModelUpdateSubscription =
      Observable.timer(0, GlobalConfig.sendEventsEveryMs).subscribe(() => this.trySendEvents().catch(() => {}));
    this._eventsDb = new PouchDB(userId + '_events');
    this._viewModelDb = new PouchDB(userId + '_viewmodel');
    this._getDataObservable = Observable.create((observer) => {
      if (this._inMemoryViewmodel)
        observer.next(this._inMemoryViewmodel);
      const changesStream = this._viewModelDb.changes(
        { live: true, include_docs: true, doc_ids: [this._authService.getUserId()] });
      changesStream.on('change', (change) => {
        observer.next(change.doc);
      });
      return () => { changesStream.cancel(); };
    });
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
    this._inMemoryViewmodel = null;
    this._getDataObservable = null;
  }

  public getData(): Observable<ApplicationViewModel> {
    return this._getDataObservable;
  }

  public getCurrentData(): Promise<ApplicationViewModel> {
    return this._viewModelDb.get(this._authService.getUserId());
  }

  public getUpdateStatus(): Observable<UpdateStatus> {
    const currentViewModelTmestamp = this.getData().map((appViewModel) => appViewModel.timestamp);
    const currentTimestamp =
      Observable.timer(0, GlobalConfig.recalculateUpdateStatusEveryMs).map(() => this._time.getUnixTimeMs());
    const lastUpdateStatus: Observable<boolean> = Observable.fromEvent(this._sendEventsLastStatusEmitter, 'status');

    return Observable.combineLatest(currentViewModelTmestamp, currentTimestamp, lastUpdateStatus,
      (modelTimestamp, timestamp, updateStatus) => {
        if (!updateStatus)
          return UpdateStatus.Red;
        const viewModelLagTimeMs = timestamp - modelTimestamp;
        if (viewModelLagTimeMs < GlobalConfig.viewModelLagTimeMsYellowStatus)
          return UpdateStatus.Green;
        else if (viewModelLagTimeMs < GlobalConfig.viewModelLagTimeMsRedStatus)
          return UpdateStatus.Yellow;
        else
          return UpdateStatus.Red;
      });
  }

  public async pushEvent(eventType: string, data: any) {
    try {
      await this._eventsDb.put({
        _id: this._time.getUnixTimeMs().toString(),
        eventType,
        data,
      });
      await this.trySendEvents();
    } catch (err) {
      this._logging.debug(JSON.stringify(err));
    }
  }

  public async trySendEvents() {
    try {
      await this.trySendEventsInternal();
      this._sendEventsLastStatusEmitter.emit('status', true);
    } catch (e) {
      this._sendEventsLastStatusEmitter.emit('status', false);
      throw e;
    }
  }

  public async setViewModel(viewModel: any) {
    viewModel._id = this._authService.getUserId();
    try {
      const viewModelTyped: ApplicationViewModel = TypedJSON.parse(JSON.stringify(viewModel), ApplicationViewModel);
      upsert(this._viewModelDb, viewModelTyped);
      this._inMemoryViewmodel = viewModelTyped;
    } catch (e) {
      this._logging.error(`Can't parse or save ApplicationViewModel: ${e}`);
      this._logging.debug(`ViewModel received from server: ${JSON.stringify(viewModel)}`);
      const errorViewModel = this.makeErrorApplicationViewModel();
      upsert(this._viewModelDb, errorViewModel);
      this._inMemoryViewmodel = errorViewModel;
    }
  }

  private async trySendEventsInternal() {
    console.debug('Trying to send events to server');
    await this.pushRefreshModelEvent();
    const alldocsResponse = await this._eventsDb.allDocs({ include_docs: true });
    const events = alldocsResponse.rows.map((row) => {
      return {
        timestamp: Number(row.doc._id),
        characterId: this._authService.getUserId(),
        eventType: row.doc.eventType,
        data: row.doc.data,
      };
    });
    console.info(`Sending ${events.length} events to server`);
    console.debug(JSON.stringify(events));
    const requestBody = JSON.stringify({ events });
    const fullUrl = GlobalConfig.sendEventsBaseUrl + '/' + this._authService.getUserId();
    try {
      const response = await this._http.post(fullUrl, requestBody,
        this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
      if (response.status == 200) {
        console.debug('Get updated viewmodel! :)');
        const updatedViewModel = response.json().viewModel;
        await this.deleteEventsBefore(updatedViewModel.timestamp);
        await this.setViewModel(updatedViewModel);
      } else if (response.status == 202) {
        console.warn('Managed to submit events, but no viewmodel :(');
        await this.deleteEventsBefore(response.json().timestamp);
        throw Error('Managed to submit events, but no viewmodel');
      } else
        throw response.toString();
    } catch (e) {
      if (e.status && (e.status == 401 || e.status == 404))
        await this._authService.logout();
      else
        throw e;
    }
  }

  private pushRefreshModelEvent(): Promise<PouchDB.Core.Response> {
    return this._eventsDb.put(this.makeRefreshModelEvent());
  }

  private makeRefreshModelEvent() {
    return {
      _id: this._time.getUnixTimeMs().toString(),
      characterId: this._authService.getUserId(),
      eventType: '_RefreshModel',
      data: {},
    };
  }

  private async deleteEventsBefore(timestamp: number) {
    console.info(`deleting events before ${timestamp}`);
    const alldocsBeforeResponse = await this._eventsDb.allDocs({
      include_docs: true,
      startkey: '0',
      endkey: timestamp.toString(),
    });

    await Promise.all(alldocsBeforeResponse.rows.map((row) => this._eventsDb.remove(row.doc._id, row.value.rev)));
  }

  private makeErrorApplicationViewModel(): ApplicationViewModel {
    const errorPage: ListPageViewModel = {
      __type: 'ListPageViewModel',
      menuTitle: 'Общая информация',
      viewId: 'page:general',
      body: {
        title: 'Ошибка',
        items: [
          { text: 'Получены некоректные данные с сервера.' },
          { text: 'Пожалуйста, обратитесь к МГ.' },
        ],
      },
    };

    return {
      _id: this._authService.getUserId(),
      timestamp: this._time.getUnixTimeMs(),
      general: { maxSecondsInVr: 0 },
      menu: { characterName: this._authService.getUserId() },
      toolbar: { hitPoints: 9000, maxHitPoints: 9000 },
      passportScreen: { corporation: 'Ошибка', email: 'Ошибка', fullName: 'Ошибка', id: this._authService.getUserId() },
      pages: [
        errorPage,
        {
          __type: 'TechnicalInfoPageViewModel',
          viewId: 'page:error',
          menuTitle: 'Техническая информация',
        },
      ],
    };
  }
}
