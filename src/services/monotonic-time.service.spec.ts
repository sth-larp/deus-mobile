import { TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing'
import * as TypeMoq from "typemoq";
import { ServerTimeService } from "./server-time.service";
import { LocalTimeService } from "./local-time.service";
import { MonotonicTimeService } from "./monotonic-time.service";
import { InMemoryNativeStorageService, NativeStorageService } from "./native-storage.service";
import { Observable } from "rxjs/Rx";

describe('MonotonicTimeService', () => {
  let fakeNativeStorage = new InMemoryNativeStorageService();
  let mockLocalTimeService: TypeMoq.IMock<LocalTimeService> = TypeMoq.Mock.ofType(LocalTimeService);
  let mockServerTimeService: TypeMoq.IMock<ServerTimeService> = TypeMoq.Mock.ofType(ServerTimeService);

  beforeEach(() => {
    fakeNativeStorage.clear();
    mockLocalTimeService.reset();
    mockServerTimeService.reset();
  });

  let makeTestMonotonicTimeService = () => new MonotonicTimeService(fakeNativeStorage, mockLocalTimeService.object, mockServerTimeService.object);

  it('Createable', () => {
    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.empty());
    expect(makeTestMonotonicTimeService()).not.toBeNull();
  });

  it('Returns estimated server time after sync', fakeAsync(() => {
    let localTime = 0;
    Observable.timer(999, 1000).take(10).subscribe(() => localTime++);
    mockLocalTimeService.setup(x => x.getUnixTimeMs()).returns(() => localTime);

    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.of(10));
    let monotonicTimeService = makeTestMonotonicTimeService();
    tick(0);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(10);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(11);
    tick(2000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(13);
    tick(4000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(17);
    tick(3000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(20);
  }));

  it('Returns estimated server time after sync after service re-creation', fakeAsync(() => {
    let localTime = 0;
    Observable.timer(999, 1000).take(10).subscribe(() => localTime++);
    mockLocalTimeService.setup(x => x.getUnixTimeMs()).returns(() => localTime);

    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.of(10));
    let monotonicTimeService = makeTestMonotonicTimeService();
    tick(0);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(10);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(11);
    tick(1000);

    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.empty());
    let monotonicTimeService2 = makeTestMonotonicTimeService();
    tick(1000);
    expect(monotonicTimeService2.getUnixTimeMs()).toEqual(13);
    tick(4000);
    expect(monotonicTimeService2.getUnixTimeMs()).toEqual(17);
    tick(3000);
    expect(monotonicTimeService2.getUnixTimeMs()).toEqual(20);
  }));

  it('Resyncs with server', fakeAsync(() => {
    let localTime = 0;
    Observable.timer(999, 1000).take(4).subscribe(() => localTime++);
    mockLocalTimeService.setup(x => x.getUnixTimeMs()).returns(() => localTime);

    let serverTime = 6;
    // Server clock is two times faster for whatever reason
    mockServerTimeService.setup(x => x.getUnixTimeMs())
      .returns(() => Observable.timer(0, 2000).take(3).map(() => serverTime += 4));
    let monotonicTimeService = makeTestMonotonicTimeService();
    tick(0);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(10);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(11);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(14);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(15);
    tick(1000);
    expect(monotonicTimeService.getUnixTimeMs()).toEqual(18);
  }));

  it('Monotonic', fakeAsync(() => {
    // We have just one point in time
    mockLocalTimeService.setup(x => x.getUnixTimeMs()).returns(() => 0);
    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.of(0));

    let monotonicTimeService = makeTestMonotonicTimeService();
    const t1 = monotonicTimeService.getUnixTimeMs();
    const t2 = monotonicTimeService.getUnixTimeMs();
    expect(t2).toBeGreaterThan(t1);
  }));

  it('Monotonic after service recreation', fakeAsync(() => {
    // We have just one point in time
    mockLocalTimeService.setup(x => x.getUnixTimeMs()).returns(() => 0);
    mockServerTimeService.setup(x => x.getUnixTimeMs()).returns(() => Observable.of(0));

    let monotonicTimeService = makeTestMonotonicTimeService();
    const t1 = monotonicTimeService.getUnixTimeMs();
    let monotonicTimeService2 = makeTestMonotonicTimeService();
    tick(); // To force async native storage access
    const t2 = monotonicTimeService2.getUnixTimeMs();
    expect(t2).toBeGreaterThan(t1);
  }));
});
