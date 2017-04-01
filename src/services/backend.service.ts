import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Response, Http } from "@angular/http";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BackendService {
  private _root_url: string = 'http://dev.alice.digital/api-mock/master';
  private _json_request_opts: RequestOptionsArgs = {
    headers: (() => {
      let h = new Headers();
      h.append('Content-Type', 'application/json');
      h.append('Accept', 'application/json');
      return h;
    })()
  };

  private sid_: string = null;
  constructor(private _http: Http) { }

  // Returns sid in case of successful authentification
  public auth(username: string, password: string): Observable<string> {
    let auth_payload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._root_url + '/auth', auth_payload, this._json_request_opts)
      .map((response: Response) => {
        if (response && response.json() && response.json()['sid']) {
          let sid: string = response.json()['sid'];
          console.log(`Successful login, get sid=${sid}`);
          return sid
        }
        return null;
      });
  }

  public setSid(sid: string) { this.sid_ = sid; }

  // Returns if access to area is allowed for currently logged user
  public access(areaName: string): Observable<boolean> {
    let access_payload = JSON.stringify({ area_name: areaName, sid: this.sid_ });
    return this._http.post(this._root_url + '/access', access_payload, this._json_request_opts)
      .map((response: Response) => {
        return (response && response.json() && response.json()['granted'])
      });
  }

  // Returns "UI state", i.e. information to generate app pages
  public submitEvents(events: Array<any>): Observable<any> {
    let submit_payload = JSON.stringify({ events: events, sid: this.sid_ });    
    return this._http.post(this._root_url + '/submit', submit_payload, this._json_request_opts)
      .map((response: Response) => {
        // TODO: get optional "config"" update?
        return response.json()['pages'];
      });
  } 
}
