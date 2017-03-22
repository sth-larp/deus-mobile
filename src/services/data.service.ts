import { Injectable } from '@angular/core'
import { Headers, Http, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { NativeStorage } from 'ionic-native';

@Injectable()
export class DataService {
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
  private _sid: string;
  constructor(private _http: Http) {
    console.log("My amazing JSON: ", JSON.stringify(JSON.parse(this._data)));
    NativeStorage.setItem('data', this._data);

    var body: string = JSON.stringify({ login: 'vasya@gmail.com', password: 'vasya' });

    var headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    var opts: RequestOptionsArgs = { headers: headers };

    this._http.post('http://dev.alice.digital/api-mock/development/auth', body, opts).subscribe(
      response => {
        var sid = response.json() && response.json().sid;
        if (sid) {
          console.log("Received sid: ", sid);
          this._sid = sid;
          var sid_body: string = JSON.stringify({ sid: this._sid });
          this._http.post('http://dev.alice.digital/api-mock/development/', body, opts).subscribe(
            response => console.log(response),
            error => console.error('post2 error: ' + JSON.stringify(error))
          )
        }
      },
      error => console.error('post error: ' + JSON.stringify(error)));
  }

  public getData(): Observable<any> {
    // TODO: update when values are updated
    return Observable.fromPromise(NativeStorage.getItem('data'))
      .map((str: string) => JSON.parse(str));
  }
}
