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

  constructor(private _http: Http) { }

  // Returns sid in case of successful authentification
  public auth(username: string, password: string): Promise<string> {
    let authPayload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._rootUrl + '/auth', authPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        if (response && response.json() && response.json()['sid']) {
          let sid: string = response.json()['sid'];
          return sid
        }
        throw "Get OK response, but no sid provided. Indicates server issue";
      }).toPromise();
  }
}
