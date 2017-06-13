import * as PouchDB from 'pouchdb';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { upsert } from "../utils/pouchdb-utils";
import { MonotonicTimeService } from "./monotonic-time.service";
import { LoginListener } from "./login-listener";
import { AuthService } from "./auth.service";

// Manages to connection to local and remote databases,
// creates per-user databases if needed.

class DbAndSync {
  public db: PouchDB.Database<{}>;
  public replication: PouchDB.Replication.Replication<{}>;
}

@Injectable()
export class DbConnectionService implements LoginListener {
  private _dbs = new Map<string, DbAndSync>();
  private _username: string = null;

  constructor(private _time: MonotonicTimeService,
    authService: AuthService) {
    authService.addListener(this);
  }

  // TODO: Declare database element types as stand-alone classes.
  public getLoggingDb(): PouchDB.Database<{ character: any; level: string; msg: string; timestamp: number; }> { return this._dbs.get("logging-dev").db; }

  public onSuccessfulLogin(username: string) {
    this._username = username;
    this._dbs.set("logging-dev", this.setupLocalAndRemoteDb("logging-dev"));
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
    let replicationOptions: any = {
      live: true,
      retry: true,
      continuous: true,
    };
    return db.replicate.to(remoteDbName, replicationOptions);
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