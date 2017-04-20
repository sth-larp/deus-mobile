import * as TypeMoq from "typemoq";
import { fakeAsync } from "@angular/core/testing";
import { UpdatablePage, UpdatablePageData } from "./updatable";
import { DataService } from "../services/data.service";
import { Observable } from "rxjs/Rx";
import { tick } from "@angular/core/testing";

class TestUpdatablePage extends UpdatablePage {
  constructor(dataService: DataService) {
    super("Test Title", dataService);
  }
  public body: any = null;
  public setBody(body: any) { this.body = body; }
}

describe('Updatable Page', () => {
  let mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType(DataService);

  const myPageData1: UpdatablePageData = {
    page_type: "Test",
    menu_title: "Test Title",
    page_title: "Test Page Title",
    body: "body1"
  };

  const myPageData2: UpdatablePageData = {
    page_type: "Test",
    menu_title: "Test Title",
    page_title: "Test Page Title",
    body: "body2"
  };

  const someOtherPageData1: UpdatablePageData = {
    page_type: "Other1",
    menu_title: "Other1 title",
    page_title: "Other1 Page Title",
    body: {}
  };

  const someOtherPageData2: UpdatablePageData = {
    page_type: "Other2",
    menu_title: "Other2 title",
    page_title: "Other2 Page Title",
    body: {}
  };

  const state1 = {pages: [myPageData1, someOtherPageData1] };
  const state2 = {pages: [myPageData1, someOtherPageData2] };
  // Here TestUpdatablePage body should change
  const state3 = {pages: [myPageData2, someOtherPageData2] };
  const state4 = {pages: [myPageData2] };

  const states: Array<any> = [state1, state2, state3, state4];

  const statePageDeleted = {pages: someOtherPageData2};
  const statesDeletion: Array<any> = [state1, statePageDeleted];

  it('Createable', () => {
    let page = new TestUpdatablePage(mockDataService.object);
  });

  it("Reacts on updates after ionViewWillEnter and ionViewDidLeave", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object);
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
    let page = new TestUpdatablePage(mockDataService.object);
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
    let page = new TestUpdatablePage(mockDataService.object);
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

  // TODO: fix it, probably by redirecting to home page
  it("Has same body after being deleted", fakeAsync(() => {
    let page = new TestUpdatablePage(mockDataService.object);
    let observable = Observable.interval(1).take(2).map(i => statePageDeleted[i]);
    mockDataService.setup(x => x.getData()).returns(() => observable);
    expect(page.body).toBeNull();
    page.ionViewWillEnter();
    tick(1); // went to state 1
    expect(page.body).toEqual("body1");
    tick(1); // went to state 2, page actually deleted
    expect(page.body).toEqual("body1");
    page.ionViewDidLeave();
  }));
});

