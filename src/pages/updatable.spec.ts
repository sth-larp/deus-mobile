import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import * as TypeMoq from 'typemoq';
import { DataService } from '../services/data.service';
import { UpdatablePage, UpdatablePageData } from './updatable';
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

class TestUpdatablePage extends UpdatablePage {
  public body: any = null;
  constructor(dataService: DataService, navCtrl: NavController) {
    super('Test Title', dataService, navCtrl);
  }
  public setBody(body: any) { this.body = body; }
}

describe('Updatable Page', () => {
  const mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType<DataService>();
  const mockNavCtrl: TypeMoq.IMock<NavController> = TypeMoq.Mock.ofType<NavController>();

  const myPageData1: UpdatablePageData = {
    pageType: 'Test',
    menuTitle: 'Test Title',
    body: 'body1',
  };

  const myPageData2: UpdatablePageData = {
    pageType: 'Test',
    menuTitle: 'Test Title',
    body: 'body2',
  };

  const someOtherPageData1: UpdatablePageData = {
    pageType: 'Other1',
    menuTitle: 'Other1 title',
    body: {},
  };

  const someOtherPageData2: UpdatablePageData = {
    pageType: 'Other2',
    menuTitle: 'Other2 title dafuw',
    body: {},
  };

  const state1 = { pages: [myPageData1, someOtherPageData1] };
  const state2 = { pages: [myPageData1, someOtherPageData2] };
  // Here TestUpdatablePage body should change
  const state3 = { pages: [myPageData2, someOtherPageData2] };
  const state4 = { pages: [myPageData2] };

  const states: any[] = [state1, state2, state3, state4];

  const statePageDeleted = { pages: [someOtherPageData2] };
  // tslint:disable-next-line:no-unused
  const statesDeletion: any[] = [state1, statePageDeleted];

  beforeEach(() => {
    mockDataService.reset();
    mockNavCtrl.reset();
  });

  it('Createable', () => {
    const page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    expect(page).not.toBeNull();
  });

  it('Reacts on updates after ionViewWillEnter and ionViewDidLeave', fakeAsync(() => {
    const page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(4).map((i) => states[i]);
    mockDataService.setup((x) => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual('body1');
    tick(1); // went to state 2
    expect(page.body).toEqual('body1');
    tick(1); // went to state 3
    expect(page.body).toEqual('body2');
    tick(1); // went to state 4
    expect(page.body).toEqual('body2');
    page.ionViewDidLeave();
  }));

  it('Does not react before ionViewWillEnter', fakeAsync(() => {
    const page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(4).map((i) => states[i]);
    mockDataService.setup((x) => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    tick(1); // went to state 1
    expect(page.body).toBeNull();
    tick(1); // went to state 2
    expect(page.body).toBeNull();
    tick(1); // went to state 3
    expect(page.body).toBeNull();
    tick(1); // went to state 4
    expect(page.body).toBeNull();
  }));

  it('Does not react after ionViewDidLeave', fakeAsync(() => {
    const page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(2).map((i) => states[i]);
    mockDataService.setup((x) => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual('body1');
    tick(1); // went to state 2
    expect(page.body).toEqual('body1');
    page.ionViewDidLeave();
    tick(1); // went to state 3
    expect(page.body).toEqual('body1');
    tick(1); // went to state 4
    expect(page.body).toEqual('body1');
  }));

  // TODO: Understand what to do with circular dependency
  // ListPage <---> UpdatablePage and fix it.
  /*
  it("Redirectes to start page if current page is deleted", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    let observable = Observable.interval(1).take(2).map(i => statesDeletion[i]);
    mockDataService.setup(x => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual("body1");
    tick(1); // went to state 2, page deleted, expected to go to start page
    mockNavCtrl.verify(x => x.setRoot(PlaygroundPage), TypeMoq.Times.once());
    page.ionViewDidLeave();
  }));
  */
});
