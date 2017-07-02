import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ServerTimeService } from './server-time.service';
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

describe('ServerTimeService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        ServerTimeService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend, options) => new Http(mockBackend, options),
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
      imports: [HttpModule],
    }).compileComponents();
  }));

  it('Createable', inject([ServerTimeService, MockBackend],
    (serverTimeService: ServerTimeService, mockBackend: MockBackend) => {
      expect(serverTimeService).not.toBeNull();
      expect(mockBackend).not.toBeNull();
    }));

  it('Successful fetches', fakeAsync(() => {
    inject([ServerTimeService, MockBackend],
      (serverTimeService: ServerTimeService, mockBackend: MockBackend) => {
        let currentTime = 0;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: { serverTime: currentTime++ },
          })));
        });

        const times = [];
        const subscription = serverTimeService.getUnixTimeMs().subscribe((t) => times.push(t));
        tick(serverTimeService.getFetchInterval() * 4);
        expect(times).toEqual([0, 1, 2, 3, 4]);
        subscription.unsubscribe();
      })();
  }));

  it('Successful and unsuccessful fetches', fakeAsync(() => {
    inject([ServerTimeService, MockBackend],
      (serverTimeService: ServerTimeService, mockBackend: MockBackend) => {
        let currentTime = 0;
        mockBackend.connections.subscribe((connection: MockConnection) => {
          if (currentTime % 2 == 0) {
            connection.mockRespond(new Response(new ResponseOptions({
              body: { serverTime: currentTime },
            })));
          } else {
            connection.mockError();
          }
          ++currentTime;
        });

        const times = [];
        const subscription = serverTimeService.getUnixTimeMs().subscribe((t) => times.push(t));
        tick(serverTimeService.getFetchInterval() * 4);
        expect(times).toEqual([0, 2, 4]);
        subscription.unsubscribe();
      })();
  }));
});
