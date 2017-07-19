import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { NavController } from 'ionic-angular';
import {} from 'jasmine';
import { Observable } from 'rxjs/Rx';
import * as TypeMoq from 'typemoq';
import { UnreadService } from '../services/unread.service';
import { ListPage, UpdatablePage } from './list';

class TestUpdatablePage extends UpdatablePage {
  public body: any = null;
  constructor(dataService: UnreadService, navCtrl: NavController) {
    super('Test Title', dataService, navCtrl);
  }
  public setBody(body: any) { this.body = body; }
}

describe('Updatable Page', () => {
  const mockUnreadService: TypeMoq.IMock<UnreadService> = TypeMoq.Mock.ofType<UnreadService>();
  const mockNavCtrl: TypeMoq.IMock<NavController> = TypeMoq.Mock.ofType<NavController>();

  const myPageData1 = {
    pageType: 'Test',
    menuTitle: 'Test Title',
    viewId: 'Test Title',
    body: 'body1',
  };

  const myPageData2 = {
    pageType: 'Test',
    menuTitle: 'Test Title',
    viewId: 'Test Title',
    body: 'body2',
  };

  const someOtherPageData1 = {
    pageType: 'Other1',
    menuTitle: 'Other1 title',
    viewId: 'Other1 title',
    body: {},
  };

  const someOtherPageData2 = {
    pageType: 'Other2',
    menuTitle: 'Other2 title dafuw',
    viewId: 'Other2 title dafuw',
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
    mockUnreadService.reset();
    mockNavCtrl.reset();
  });

  it('Createable', () => {
    const page = new TestUpdatablePage(mockUnreadService.object, mockNavCtrl.object);
    expect(page).not.toBeNull();
  });

  it('Reacts on updates after ionViewWillEnter and ionViewDidLeave', fakeAsync(() => {
    const page = new TestUpdatablePage(mockUnreadService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(4).map((i) => states[i]);
    mockUnreadService.setup((x) => x.getDataWithUnreadStatus()).returns(() => observable);
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
    const page = new TestUpdatablePage(mockUnreadService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(4).map((i) => states[i]);
    mockUnreadService.setup((x) => x.getDataWithUnreadStatus()).returns(() => observable);
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
    const page = new TestUpdatablePage(mockUnreadService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(2).map((i) => states[i]);
    mockUnreadService.setup((x) => x.getDataWithUnreadStatus()).returns(() => observable);
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

  it('Redirectes to start page if current page is deleted', fakeAsync(() => {
    const page = new TestUpdatablePage(mockUnreadService.object, mockNavCtrl.object);
    const observable = Observable.interval(1).take(2).map((i) => statesDeletion[i]);
    mockUnreadService.setup((x) => x.getDataWithUnreadStatus()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual('body1');
    tick(1); // went to state 2, page deleted, expected to go to start page
    mockNavCtrl.verify((x) => x.setRoot(ListPage, TypeMoq.It.isValue({id: 'page:general'})), TypeMoq.Times.once());
    page.ionViewDidLeave();
  }));
});
