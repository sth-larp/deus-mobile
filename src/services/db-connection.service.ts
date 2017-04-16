import * as PouchDB from 'pouchdb';
import { Injectable } from "@angular/core";
import { upsert } from "../utils/pouchdb-utils";

// Manages to connection to local and remote databases,
// creates per-user databases if needed.

@Injectable()
export class DbConnectionService {
  public pagesDb: PouchDB.Database<{}>;
  public eventsDb: PouchDB.Database<{}>;
  public loggingDb: PouchDB.Database<{}>;

  public onLogin(username: string) {
    this.pagesDb = this.setupLocalAndRemoteDb(username, "pages-dev");
    this.eventsDb = this.setupLocalAndRemoteDb(username, "events-dev");
    this.loggingDb = this.setupLocalAndRemoteDb(username, "logging-dev");

    this._setUpLoggingDb();
  }

  public onLogout() {
    // TODO: Is this enough? What if someone already subscribed for some events from
    // existing databases.
    this.pagesDb = null;
    this.eventsDb = null;
    this.loggingDb = null;
  }

  private setupLocalAndRemoteDb(username: string, dbName: string): PouchDB.Database<{}> {
    // TODO: remove slice hack when we switch to proper usernames
    const localDbName = `${username.slice(0, 5)}_${dbName}`;
    let db = new PouchDB(localDbName);

    // TODO: provide proper credentials
    const removeDbName = `http://dev.alice.digital:5984/${dbName}`;
    let replicationOptions = {
      live: true,
      retry: true,
      continuous: true,
      filter: 'character/by_name',
      query_params: { "character": username }
    };
    db.sync(removeDbName, replicationOptions);
    return db;
  }

  private _setUpLoggingDb() {
    upsert(this.loggingDb, {
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