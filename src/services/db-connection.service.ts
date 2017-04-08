import PouchDB from 'pouchdb';
import { Injectable } from "@angular/core";

// Manages to connection to local and remote databases,
// creates per-user databases if needed.

@Injectable()
export class DbConnectionService {
  public pagesDb: PouchDB.Database<{}>;
  public eventsDb: PouchDB.Database<{}>;

  public onLogin(username: string) {
    this.pagesDb = this.setupLocalAndRemoteDb(username, "pages");
    this.eventsDb = this.setupLocalAndRemoteDb(username, "events");
  }

  public onLogout() {
    // TODO: Is this enough? What if someone already subscribed for some events from
    // existing databases.
    this.pagesDb = null;
    this.eventsDb = null;
  }

  private setupLocalAndRemoteDb(username: string, dbName: string) : PouchDB.Database<{}> {
    // TODO: remove slice hack when we switch to proper usernames
    const localDbName = `${username.slice(0, 5)}_${dbName}`;
    let db = new PouchDB(localDbName);

    // TODO: provide proper credentials
    const removeDbName = `https://aeremin:petya@aeremin.cloudant.com/${localDbName}`;
    let replicationOptions = {
      live: true,
      retry: true,
      continuous: true,
    };
    db.sync(removeDbName, replicationOptions);
    return db;
  }
}