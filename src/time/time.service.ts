import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { NativeStorage } from 'ionic-native';

@Injectable()
export class TimeService {
    private _url: string = 'https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec';
    constructor(private _http: Http) {}
    
    getTime() : Observable<any> {
        var observableHttp: Observable<any> = this._http.get(this._url)
            .map((response : Response) => response.json())
            .do(json => console.log('Received json: ' + JSON.stringify(json)))
            .do(json => this._cacheTime(json));
        var observableLocal: Observable<any> = this._getCachedTime();
        return Observable.onErrorResumeNext(observableLocal, observableHttp);
    }

    private _cacheTime(json : any) : void {
        NativeStorage.setItem('current_time', json)
            .then(
                () => console.log('Stored item!'),
                error => console.error('Error storing item', error)
            );
    }

    private _getCachedTime() : Observable<any> {
        return Observable.fromPromise(NativeStorage.getItem('current_time'));
    }

}

