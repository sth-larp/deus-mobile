import * as TypeMoq from "typemoq";
import { fakeAsync } from "@angular/core/testing";
import { UpdatablePage, UpdatablePageData } from "./updatable";
import { DataService } from "../services/data.service";
import { Observable } from "rxjs/Rx";
import { tick } from "@angular/core/testing";
import { NavController } from "ionic-angular";
import { PlaygroundPage } from "./playground";

class TestUpdatablePage extends UpdatablePage {
  constructor(dataService: DataService, navCtrl: NavController) {
    super("Test Title", dataService, navCtrl);
  }
  public body: any = null;
  public setBody(body: any) { this.body = body; }
}

describe('Updatable Page', () => {
  let mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType(DataService);
  let mockNavCtrl: TypeMoq.IMock<NavController> = TypeMoq.Mock.ofType<NavController>();

  const myPageData1: UpdatablePageData = {
    pageType: "Test",
    menuTitle: "Test Title",
    body: "body1"
  };

  const myPageData2: UpdatablePageData = {
    pageType: "Test",
    menuTitle: "Test Title",
    body: "body2"
  };

  const someOtherPageData1: UpdatablePageData = {
    pageType: "Other1",
    menuTitle: "Other1 title",
    body: {}
  };

  const someOtherPageData2: UpdatablePageData = {
    pageType: "Other2",
    menuTitle: "Other2 title dafuw",
    body: {}
  };

  const state1 = { pages: [myPageData1, someOtherPageData1] };
  const state2 = { pages: [myPageData1, someOtherPageData2] };
  // Here TestUpdatablePage body should change
  const state3 = { pages: [myPageData2, someOtherPageData2] };
  const state4 = { pages: [myPageData2] };

  const states: Array<any> = [state1, state2, state3, state4];

  const statePageDeleted = { pages: [someOtherPageData2] };
  const statesDeletion: Array<any> = [state1, statePageDeleted];

  beforeEach(() => {
    mockDataService.reset();
    mockNavCtrl.reset();
  });

  it('Createable', () => {
    let page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    expect(page).not.toBeNull();
  });

  it("Reacts on updates after ionViewWillEnter and ionViewDidLeave", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    let observable = Observable.interval(1).take(4).map(i => states[i]);
    mockDataService.setup(x => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual("body1");
    tick(1); // went to state 2
    expect(page.body).toEqual("body1");
    tick(1); // went to state 3
    expect(page.body).toEqual("body2");
    tick(1); // went to state 4
    expect(page.body).toEqual("body2");
    page.ionViewDidLeave();
  }));

  it("Does not react before ionViewWillEnter", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    let observable = Observable.interval(1).take(4).map(i => states[i]);
    mockDataService.setup(x => x.getData()).returns(() => observable);
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

  it("Does not react after ionViewDidLeave", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object, mockNavCtrl.object);
    let observable = Observable.interval(1).take(2).map(i => states[i]);
    mockDataService.setup(x => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual("body1");
    tick(1); // went to state 2
    expect(page.body).toEqual("body1");
    page.ionViewDidLeave();
    tick(1); // went to state 3
    expect(page.body).toEqual("body1");
    tick(1); // went to state 4
    expect(page.body).toEqual("body1");
  }));

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
});

