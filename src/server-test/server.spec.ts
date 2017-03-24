/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { ReflectiveInjector } from '@angular/core';
import {
  CookieXSRFStrategy, Http, XHRBackend, ConnectionBackend, BrowserXhr, XSRFStrategy, BaseResponseOptions,
  RequestOptions, BaseRequestOptions, ResponseOptions, RequestOptionsArgs, Headers
} from '@angular/http';

class MyCookieXSRFStrategy extends CookieXSRFStrategy { }

describe('Server API', () => {
  let http = ReflectiveInjector.resolveAndCreate([
    Http, BrowserXhr,
    { provide: ConnectionBackend, useClass: XHRBackend },
    { provide: ResponseOptions, useClass: BaseResponseOptions },
    { provide: XSRFStrategy, useClass: MyCookieXSRFStrategy },
    { provide: RequestOptions, useClass: BaseRequestOptions }
  ]).get(Http);

  let valid_login_payload: string = JSON.stringify({ login: 'vasya@gmail.com', password: 'vasya' });
  let invalid_login_payload: string = JSON.stringify({ login: 'vasya@gmail.com', password: '1234' });

  let request_opts: RequestOptionsArgs = { headers: (() => {
    let h = new Headers();
    h.append('Content-Type', 'application/json');
    h.append('Accept', 'application/json');
    return h;
  })()};

  let root_url: string = 'http://dev.alice.digital/api-mock/master';

  it('Authentificate and get status', (done: DoneFn) => {
    http.post(root_url + '/auth', valid_login_payload, request_opts).subscribe(
      response => {
        expect(response.json()).toBeTruthy();
        let sid = response.json()['sid'];
        expect(sid).toBeDefined();
        let sid_payload: string = JSON.stringify({ sid: sid });
        http.post(root_url + '/', sid_payload, request_opts).subscribe(
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
    http.post(root_url + '/auth', invalid_login_payload, request_opts).subscribe(
      response => done.fail('Can login with invalid credentials'),
      error => done()
    );
  });

  it('Status without auth', (done: DoneFn) => {
    http.post(root_url + '/', JSON.stringify(''), request_opts).subscribe(
      response => done.fail('Can get status without auth'),
      error => done()
    );
  });
});
