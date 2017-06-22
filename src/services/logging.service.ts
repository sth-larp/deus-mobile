import * as PouchDB from 'pouchdb'
import { Injectable } from '@angular/core'
import { NativeStorage } from "ionic-native/dist/es5";
import { LoginListener } from "./login-listener";
import { AuthService } from "./auth.service";
import { upsert } from "../utils/pouchdb-utils";
import { GlobalConfig } from "../config";

export class NoOpLoggingService {
  public debug(msg: string) { };
  public info(msg: string) { };
  public warning(msg: string) { };
  public error(msg: string) { };
}


@Injectable()
export class LoggingService implements LoggingService, LoginListener {
  private _loggingDb: PouchDB.Database<{ character: string, level: string, msg: string, timestamp: number }> = null;
  private _loggingDbReplication: PouchDB.Replication.Replication<{}> = null;
  private _username: string = null;

  constructor(authService: AuthService) {
    authService.addListener(this);
  }

  public debug(msg: string) {
    console.debug(msg);
    this._log(msg, "debug");
  }

  public info(msg: string) {
    console.info(msg);
    this._log(msg, "info");
  }

  public warning(msg: string) {
    console.warn(msg);
    this._log(msg, "warning");
  }

  public error(msg: string) {
    console.error(msg);
    this._log(msg, "error");
  }

  public getLoggingDb() { return this._loggingDb; }

  private _log(msg: string, level: string) {
    const currentDate = new Date();
    NativeStorage.getItem('username')
      .then(username => {
        return this._loggingDb.post(
          { character: username, level: level, msg: msg, timestamp: currentDate.valueOf() }
        );
      })
      .then(resp => {
        if (!resp.ok)
          console.debug("Error placing logging record to db: " + JSON.stringify(resp))
      })
      .catch(err =>
        console.log("Error placing logging record to db, maybe due to not being logged yet? ", JSON.stringify(err)));

  }

  public onSuccessfulLogin(username: string) {
    this._username = username;
    // TODO: rename test accounts to not have @ in them and remove replace.
    const localDbName = `${this._username.replace("@", "")}_logging-dev`;
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
    this._username = null;
    if (this._loggingDb) {
      this._loggingDbReplication.cancel();
      this._loggingDbReplication = null;
      this._loggingDb = null;
    }
  }

  private _setUpLoggingDb() {
    upsert(this._loggingDb, {
      _id: "_design/mobile",
      views: {
        debug: {
          map: "function (doc) { if (doc.timestamp) emit(doc.timestamp); }"
        },
        info: {
          map: "function (doc) { if (doc.timestamp && (doc.level == 'info' || doc.level == 'warning' || doc.level == 'error')) emit(doc.timestamp); }"
        },
        warning: {
          map: "function (doc) { if (doc.timestamp && (doc.level == 'warning' || doc.level == 'error')) emit(doc.timestamp); }"
        },
        error: {
          map: "function (doc) { if (doc.timestamp && doc.level == 'error') emit(doc.timestamp); }"
        }
      }
    });
  }
}

