/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { ExampleService } from './example.service';
import { ReflectiveInjector } from '@angular/core';
import {
  CookieXSRFStrategy, Http, XHRBackend, ConnectionBackend, BrowserXhr, XSRFStrategy, BaseResponseOptions,
  RequestOptions, BaseRequestOptions, ResponseOptions, RequestOptionsArgs, Headers
} from '@angular/http';

class MyCookieXSRFStrategy extends CookieXSRFStrategy { }

describe('ExampleService', () => {
  it('exists', (done: DoneFn) => {
    let http = ReflectiveInjector.resolveAndCreate([
      Http, BrowserXhr,
      { provide: ConnectionBackend, useClass: XHRBackend },
      { provide: ResponseOptions, useClass: BaseResponseOptions },
      { provide: XSRFStrategy, useClass: MyCookieXSRFStrategy },
      { provide: RequestOptions, useClass: BaseRequestOptions }
    ]).get(Http);

    var body: string = JSON.stringify({ login: 'vasya@gmail.com', password: 'vasya' });

    var headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    var opts: RequestOptionsArgs = { headers: headers };
    http.post('http://dev.alice.digital/api-mock/development/auth', body, opts).subscribe(
      response => {console.log("ffff"), done() },
      error => {console.log("ffsssssff"), done() },
    )
  });
});
