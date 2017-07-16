import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { GlobalConfig } from '../config';
import { upsert } from '../utils/pouchdb-utils';
import { ILoginListener } from './login-listener';
import { MonotonicTimeService } from './monotonic-time.service';

export class NoOpLoggingService {
  public debug(_msg: string) { }
  public info(_msg: string) { }
  public warning(_msg: string) { }
  public error(_msg: string) { }
}

@Injectable()
export class LoggingService implements LoggingService, ILoginListener {
  private _loggingDb: PouchDB.Database<{ character: string, level: string, msg: string, timestamp: number }> = null;
  private _loggingDbReplication: PouchDB.Replication.Replication<{}> = null;
  private _userId: string = null;

  constructor(private _monotonicTimeService: MonotonicTimeService) {
    // authService.addListener(this);
    this.onSuccessfulLogin('vasya');
  }

  public debug(msg: string) {
    console.debug(msg);
    this._log(msg, 'debug');
  }

  public info(msg: string) {
    console.info(msg);
    this._log(msg, 'info');
  }

  public warning(msg: string) {
    console.warn(msg);
    this._log(msg, 'warning');
  }

  public error(msg: string) {
    console.error(msg);
    this._log(msg, 'error');
  }

  public getLoggingDb() { return this._loggingDb; }

  public onSuccessfulLogin(userId: string) {
    this._userId = userId;
    const localDbName = `${this._userId}_logging-dev`;
    this._loggingDb = new PouchDB(localDbName);
    this._setUpLoggingDb();
    const replicationOptions: any = {
      live: true,
      retry: true,
      continuous: true,
    };
    this._loggingDbReplication = this._loggingDb.replicate.to(
      GlobalConfig.remoteLoggingDbUrl, replicationOptions);
  }

  public onLogout() {
    this._userId = null;
    if (this._loggingDb) {
      this._loggingDbReplication.cancel();
      this._loggingDbReplication = null;
      this._loggingDb = null;
    }
  }

  private _log(msg: string, level: string) {
    if (this._userId) {
      this._loggingDb.post(
        { character: this._userId, level, msg, timestamp: this._monotonicTimeService.getUnixTimeMs() },
      )
        .then((resp) => {
          if (!resp.ok)
            console.error('Error placing logging record to db: ' + JSON.stringify(resp));
        })
        .catch((err) =>
          console.error('Error placing logging record to db ', JSON.stringify(err)));
    } else {
      console.warn("Can't log into DB, not logged in yet");
    }
  }

  private _setUpLoggingDb() {
    upsert(this._loggingDb, {
      _id: '_design/mobile',
      views: {
        debug: {
          map: 'function (doc) { if (doc.timestamp) emit(doc.timestamp); }',
        },
        info: {
          // tslint:disable-next-line:max-line-length
          map: "function (doc) { if (doc.timestamp && (doc.level == 'info' || doc.level == 'warning' || doc.level == 'error')) emit(doc.timestamp); }",
        },
        warning: {
          // tslint:disable-next-line:max-line-length
          map: "function (doc) { if (doc.timestamp && (doc.level == 'warning' || doc.level == 'error')) emit(doc.timestamp); }",
        },
        error: {
          map: "function (doc) { if (doc.timestamp && doc.level == 'error') emit(doc.timestamp); }",
        },
      },
    });
  }
}
