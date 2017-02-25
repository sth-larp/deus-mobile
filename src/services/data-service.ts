import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx';

import { NativeStorage } from 'ionic-native';

@Injectable()
export class DataService {
    private _data: string = `
    {
        "values": ["foo", "bar", "buz"],
        "plain_text": {
            "title": "Hi!",
            "content": "Hello, world!"
        }
    }
    `;
    constructor() {
        //console.log("My amazing JSON: ", JSON.stringify(JSON.parse(this._data)));
        NativeStorage.setItem('data', this._data);
    }
    public getData() : Observable<any> {
        // TODO: update when values are updated
        return Observable.fromPromise(NativeStorage.getItem('data'))
            .map((str : string) => JSON.parse(str));
    }
}
