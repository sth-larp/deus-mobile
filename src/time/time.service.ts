import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TimeService {
    private _url: string = 'https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec';
    constructor(private _http: Http) {}
    
    getTime() : Observable<any> {
        return this._http.get(this._url)
            .map((response : Response) => response.json())
            .do(json => console.log('Received json: ' + JSON.stringify(json)));
    }
}