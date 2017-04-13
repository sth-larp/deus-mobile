import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Response, Http } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { LoggingService } from "./logging.service";

@Injectable()
export class BackendService {
  private _rootUrl: string = 'http://dev.alice.digital/api-mock/master';
  private _jsonRequestOpts: RequestOptionsArgs = {
    headers: (() => {
      let h = new Headers();
      h.append('Content-Type', 'application/json');
      h.append('Accept', 'application/json');
      return h;
    })()
  };

  private _sid: string = null;
  constructor(private _http: Http,
              private _logging: LoggingService) { }

  // Returns sid in case of successful authentification
  public auth(username: string, password: string): Promise<string> {
    let authPayload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._rootUrl + '/auth', authPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        if (response && response.json() && response.json()['sid']) {
          let sid: string = response.json()['sid'];
          this._logging.debug(`Successful login, get sid=${sid}`);
          return sid
        }
        throw "Get OK response, but no sid provided. Indicates server issue";
      }).toPromise();
  }

  public setSid(sid: string) { this._sid = sid; }

  // Returns if access to area is allowed for currently logged user
  public access(areaName: string): Observable<boolean> {
    let accessPayload = JSON.stringify({ area_name: areaName, sid: this._sid });
    return this._http.post(this._rootUrl + '/access', accessPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        return (response && response.json() && response.json()['granted'])
      });
  }
}
