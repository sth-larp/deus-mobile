import * as PouchDB from 'pouchdb';
import { Injectable } from "@angular/core";

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
  }

  public onLogout() {
    // TODO: Is this enough? What if someone already subscribed for some events from
    // existing databases.
    this.pagesDb = null;
    this.eventsDb = null;
    this.loggingDb = null;
  }

  private setupLocalAndRemoteDb(username: string, dbName: string) : PouchDB.Database<{}> {
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
}