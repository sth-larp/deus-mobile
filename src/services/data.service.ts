import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx';
import { NativeStorage } from 'ionic-native';
import { FirebaseService } from '../services/firebase.service';

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
  // TODO: Can we force FirebaseService instantiation without that hack?
  constructor(private _firebaseService : FirebaseService) {
    console.log("My amazing JSON: ", JSON.stringify(JSON.parse(this._data)));
    NativeStorage.setItem('data', this._data);
  }

  public getData(): Observable<any> {
    // TODO: update when values are updated
    return Observable.fromPromise(NativeStorage.getItem('data'))
      .map((str: string) => JSON.parse(str));
  }
}
