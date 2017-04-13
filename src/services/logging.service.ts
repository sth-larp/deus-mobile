import { Injectable } from '@angular/core'
import { DbConnectionService } from "./db-connection.service";
import { NativeStorage } from "ionic-native/dist/es5";

export class NoOpLoggingService {
  public debug(msg: string) { };
  public info(msg: string) { };
  public warning(msg: string) { };
  public error(msg: string) { };
}


@Injectable()
export class LoggingService implements LoggingService {
  constructor(private _dbConnectionService: DbConnectionService) { }

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

  private _log(msg: string, level: string) {
    const currentDate = new Date();
    NativeStorage.getItem('username')
      .then(username => {
        return this._dbConnectionService.loggingDb.post(
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
}

