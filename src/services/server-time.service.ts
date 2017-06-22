import { GlobalConfig } from '../config';

import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";

@Injectable()
export class ServerTimeService {
  constructor(private _http: Http) { }
  public getUnixTimeMs(): Observable<number> {
    return Observable.timer(0, GlobalConfig.fetchTimeFromServerEveryMs)
      .flatMap(() => {
        return this._http.get(GlobalConfig.timeServerUrl)
          .map(response => response.json().serverTime)
          .catch(err => Observable.empty());
      });
  }

  public getFetchInterval(): number {
    return GlobalConfig.fetchTimeFromServerEveryMs;
  }
}