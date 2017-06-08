import * as PouchDB from 'pouchdb';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { upsert } from "../utils/pouchdb-utils";

// Manages to connection to local and remote databases,
// creates per-user databases if needed.

class DbAndSync {
  public db: PouchDB.Database<{}>;
  public replication: PouchDB.Replication.Replication<{}>;
}

export enum UpdateStatus {
  Green,
  Yellow,
  Red
}

@Injectable()
export class DbConnectionService {
  private _dbs = new Map<string, DbAndSync>();
  private _username: string = null;
  private _lastUpdateTime: number;
  private _updateStatus: Observable<any>;

  constructor() {
    this._updateStatus = Observable.timer(100, 100).map(() => {
      // TODO: consider relying on replicated paused/resumed events instead
      let timeElapsedSec = (performance.now() - this._lastUpdateTime) / 1000;
      if (timeElapsedSec < 5)
        return UpdateStatus.Green;
      else if (timeElapsedSec < 30)  // TODO: increase
        return UpdateStatus.Yellow;
      else
        return UpdateStatus.Red;
    });
  }

  // TODO: Declare database element types as stand-alone classes.
  public getLoggingDb(): PouchDB.Database<{ character: any; level: string; msg: string; timestamp: number; }> { return this._dbs.get("logging-dev").db; }
  public getViewModelDb(): PouchDB.Database<{}> { return this._dbs.get("view-models-dev2").db; }
  public getEventsDb(): PouchDB.Database<{ characterId: string; timestamp: number; eventType: string; data: any; }> { return this._dbs.get("events-dev2").db; }

  public getUpdateStatus(): Observable<any> { return this._updateStatus; }

  public onLogin(username: string) {
    this._username = username;
    this._dbs.set("view-models-dev2", this.setupLocalAndRemoteDb("view-models-dev2"));
    this._dbs.set("events-dev2", this.setupLocalAndRemoteDb("events-dev2"));
    this._dbs.set("logging-dev", this.setupLocalAndRemoteDb("logging-dev"));

    // TODO: fix
    this._dbs.get("view-models-dev2").replication
      .on('complete', (info) => {
        this._lastUpdateTime = performance.now();
      }).on('change', (change) => {
        // yo, something changed!
        this._lastUpdateTime = performance.now();
      }).on('paused', (info) => {
        // replication was paused, usually because of a lost connection
      }).on('error', (err) => {
        // totally unhandled error (shouldn't happen)
      });

    this._setUpLoggingDb();
  }

  public onLogout() {
    this._username = null;
    this._dbs.forEach((dbAndSync, name) => dbAndSync.replication.cancel());
    this._dbs.clear();
  }

  public forceSync() {
    this._dbs.forEach((dbAndSync, name) => {
      dbAndSync.replication.cancel();
      dbAndSync.replication = this.setUpSyncFor(dbAndSync.db, name);
    });
  }

  private setupLocalAndRemoteDb(dbName: string): DbAndSync {
    const localDbName = `${this._username.replace("@", "")}_${dbName}`;
    let db = new PouchDB(localDbName);
    return { db: db, replication: this.setUpSyncFor(db, dbName) };
  }

  private setUpSyncFor(db: PouchDB.Database<{}>,
    dbName: string): PouchDB.Replication.Replication<{}> {
    // TODO: provide proper credentials
    const remoteDbName = `http://dev.alice.digital:5984/${dbName}`;
    const serverToClient = dbName.includes('pages') || dbName.includes('view-model');
    let replicationOptions: any = {
      live: true,
      retry: true,
      continuous: true,
    };
    if (serverToClient) {
      replicationOptions.filter = 'character/by_name';
      replicationOptions.query_params = { "character": this._username }
      return db.replicate.from(remoteDbName, replicationOptions);
    } else {
      return db.replicate.to(remoteDbName, replicationOptions);
    }
  }

  private _setUpLoggingDb() {
    upsert(this.getLoggingDb(), {
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