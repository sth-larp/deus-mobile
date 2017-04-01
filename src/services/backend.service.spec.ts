/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, inject, async } from '@angular/core/testing'
import { Http, HttpModule, BaseRequestOptions, Response, ResponseOptions } from '@angular/http'
import { MockBackend } from '@angular/http/testing'
import { BackendService } from './backend.service'

describe('BackendService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        BackendService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (mockBackend, options) => { return new Http(mockBackend, options) },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [HttpModule]
    }).compileComponents();
  }));

  it('Createable', inject([BackendService, MockBackend],
    (backendService: BackendService, mockBackend: MockBackend) => {
      expect(backendService).not.toBeNull();
      expect(mockBackend).not.toBeNull();
    }));

  it('Auth: success', (done: DoneFn) => {
    inject([BackendService, MockBackend],
      (backendService: BackendService, mockBackend: MockBackend) => {
        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: '{ "sid": "123" }'
          })))
        });
        backendService.auth("", "").subscribe((sid) => {
          expect(sid).toEqual("123");
          done();
        });
      })();
  });

  it('Auth: no sid', (done: DoneFn) => {
    inject([BackendService, MockBackend],
      (backendService: BackendService, mockBackend: MockBackend) => {
        mockBackend.connections.subscribe((connection) => {
          connection.mockError(new Error("access denied"));
        });
        backendService.auth("", "").subscribe((sid) => {
          done.fail("Should not be authorized");
        }, err => done());
      })();
  });

});