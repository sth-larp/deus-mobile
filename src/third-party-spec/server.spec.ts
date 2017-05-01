/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
/*
import { ReflectiveInjector } from '@angular/core';
import {
  CookieXSRFStrategy, Http, XHRBackend, ConnectionBackend, BrowserXhr, XSRFStrategy, BaseResponseOptions,
  RequestOptions, BaseRequestOptions, ResponseOptions, RequestOptionsArgs, Headers
} from '@angular/http';
describe('Server API', () => {
  let http = ReflectiveInjector.resolveAndCreate([
    Http, BrowserXhr,
    { provide: ConnectionBackend, useClass: XHRBackend },
    { provide: ResponseOptions, useClass: BaseResponseOptions },
    { provide: XSRFStrategy, useValue: new CookieXSRFStrategy('RESPONSE_TOKEN', 'X-CSRFToken') },
    { provide: RequestOptions, useClass: BaseRequestOptions }
  ]).get(Http);

  let validLoginPayload: string = JSON.stringify({ login: 'vasya@gmail.com', password: 'vasya' });
  let invalidLoginPayload: string = JSON.stringify({ login: 'vasya@gmail.com', password: '1234' });

  let requestOpts: RequestOptionsArgs = { headers: (() => {
    let h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Accept', 'application/json');
    return h;
  })()};

  let rootUrl: string = 'http://dev.alice.digital/api-mock/master';

  it('Authentificate and get status', (done: DoneFn) => {
    http.post(rootUrl + '/auth', validLoginPayload, requestOpts).subscribe(
      response => {
        expect(response.json()).toBeTruthy();
        let sid = response.json()['sid'];
        expect(sid).toBeDefined();
        let sidPayload: string = JSON.stringify({ sid: sid });
        http.post(rootUrl + '/', sidPayload, requestOpts).subscribe(
          response => {
            expect(response.json()).toBeTruthy();
            let state = response.json()['state'];
            expect(state).toBeDefined();
            let name = state['name'];
            expect(name).toBe('vasya@gmail.com');
            done();
          },
          error => done.fail('Failed to get status'));
      },
      error => done.fail('Failed to auth'),
    )
  });

  it('Auth with wrong credentials', (done: DoneFn) => {
    http.post(rootUrl + '/auth', invalidLoginPayload, requestOpts).subscribe(
      response => done.fail('Can login with invalid credentials'),
      error => done()
    );
  });

  it('Status without auth', (done: DoneFn) => {
    http.post(rootUrl + '/', JSON.stringify(''), requestOpts).subscribe(
      response => done.fail('Can get status without auth'),
      error => done()
    );
  });
});
*/