import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Response, Http } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { LoggingService } from "./logging.service";
import { GlobalConfig } from "../config";

@Injectable()
export class BackendService {
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
    return this._http.post(GlobalConfig.authentificationUrl, authPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        if (response && response.json() && response.json()['sid']) {
          let sid: string = response.json()['sid'];
          return sid
        }
        throw "Get OK response, but no sid provided. Indicates server issue";
      }).toPromise();
  }
}
