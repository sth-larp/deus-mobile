import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { NativeStorage } from 'ionic-native';
import { FirebaseService } from '../services/firebase.service';
import { Headers, RequestOptionsArgs, Http } from "@angular/http";
import { LoginPage } from "../pages/login/login";

@Injectable()
export class DataService {
  private _root_url: string = 'http://dev.alice.digital/api-mock/master';
  private _json_request_opts: RequestOptionsArgs = {
    headers: (() => {
      let h = new Headers();
      h.append('Content-Type', 'application/json');
      h.append('Accept', 'application/json');
      return h;
    })()
  };

  private _data: string = `
  {
    "pages": [
      {
        "page_type": "plain_text",
        "page_title": "Plain text page",
        "tab_title": "Plain 1",
        "tab_icon": "information-circle",
        "body": {
          "content": "Hello, world 1!"
        }
      },
      {
        "page_type": "plain_text",
        "page_title": "",
        "tab_title": "Plain 2",
        "tab_icon": "information-circle",
        "body": {
          "content": "Hello, world 2!"
        }
      },
      {
        "page_type": "list",
        "page_title": "List page",
        "tab_title": "List",
        "tab_icon": "information-circle",
        "body": {
          "items": [
            {
              "text": "foo",
              "subtext": "subfoo"
            },
            {
              "text": "bar",
              "subtext": "subbar"
            },
            {
              "text": "buz",
              "subtext": "subbuz"
            }
          ]
        }
      },
      {
        "page_type": "playground",
        "page_title": "Playground page",
        "tab_title": "Playground",
        "tab_icon": "home"
      },
      {
        "page_type": "unknown",
        "tab_title": "Unknown",
        "tab_icon": "contacts"
      }
    ]
  }
  `;
  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService: FirebaseService, private _http: Http) {
    console.log("My amazing JSON: ", JSON.stringify(JSON.parse(this._data)));
    NativeStorage.setItem('data', this._data);
  }

  public getData(): Observable<any> {
    // TODO: update when values are updated
    return Observable.fromPromise(NativeStorage.getItem('data'))
      .map((str: string) => JSON.parse(str));
  }

  public getSid(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('sid')); 
  }
  public getUsername(): Observable<string> {
    return Observable.fromPromise(NativeStorage.getItem('username')); 
  }

  public login(username: string, password: string): Observable<boolean> {
    let login_payload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._root_url + '/auth', login_payload, this._json_request_opts)
      .map((response: any) => {
        if (response && response.json() && response.json()['sid']) {
          console.log("Successful login!");
          this._setCredentials(response.json()['sid'], username);
          return true;
        }
        return false;
      });
  }

  public logout() {
    NativeStorage.remove('sid');
    NativeStorage.remove('username');
  }

  private _setCredentials(sid: string, username: string) {
    NativeStorage.setItem('sid', sid);
    NativeStorage.setItem('username', username);
  }
}
