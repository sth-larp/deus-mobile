import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";

@Injectable()
export class ServerTimeService {
  private _fetchTimeEveryMs = 5000;
  // TODO: Switch to remote server
  private _url = "http://localhost:3000";
  constructor(private _http: Http) { }
  public getUnixTimeMs(): Observable<number> {
    return Observable.timer(0, this._fetchTimeEveryMs).flatMap(() => {
      return this._http.get(this._url)
        .map(response => {
          return response.json()["time"];
        })
        .catch(err => { return Observable.empty(); })
    });
  }

  public getFetchInterval(): number { return this._fetchTimeEveryMs; }
}