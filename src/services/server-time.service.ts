import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";

@Injectable()
export class ServerTimeService {
  private _fetchTimeEveryMs = 60000;
  private _url = "http://dev.alice.digital:8157/time";
  constructor(private _http: Http) { }
  public getUnixTimeMs(): Observable<number> {
    return Observable.timer(0, this._fetchTimeEveryMs).flatMap(() => {
      return this._http.get(this._url)
        .map(response => response.json().serverTime)
        .catch(err => Observable.empty());
    });
  }

  public getFetchInterval(): number { return this._fetchTimeEveryMs; }
}