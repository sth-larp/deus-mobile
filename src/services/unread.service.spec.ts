import { fakeAsync, tick } from '@angular/core/testing';
import {} from 'jasmine';
import { Observable } from 'rxjs/Rx';
import * as TypeMoq from 'typemoq';

import { DataService } from './data.service';
import { FakeLocalDataService } from './local-data.service';
import { UnreadService } from './unread.service';
import { ApplicationViewModel, ListBody, ListPageViewModel } from './viewmodel.types';

describe('UnreadService', () => {
  const mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType<DataService>();
  let unreadService: UnreadService = null;
  let numUnreadChanges: number = null;
  let dataWithUnreadStatus: ApplicationViewModel = null;

  // Creates unreadService that gets models from 'models', one per tick.
  // Puts results of 'numUnreadChanges' and 'getDataWithUnreadStatus' into
  // the corresponding local variables.
  function setupTest(models: ApplicationViewModel[]): void {
    const modelsObservable = Observable.interval(1).take(models.length).map((i) => models[i]);
    mockDataService.reset();
    mockDataService.setup((x) => x.getData()).returns(() => modelsObservable);
    unreadService = new UnreadService(new FakeLocalDataService(), mockDataService.object);
    numUnreadChanges = null;
    dataWithUnreadStatus = null;
    unreadService.numUnreadChanges().subscribe((value) => {
      numUnreadChanges = value;
    });
    unreadService.getDataWithUnreadStatus().subscribe((value) => {
      dataWithUnreadStatus = value;
    });
  };

  function getListPageBody(model: ApplicationViewModel, numPage: number): ListBody {
    return (model.pages[numPage] as ListPageViewModel).body;
  }

  it ('Marks unread and then read', fakeAsync(() => {
    const model: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:0' },
            ]
          },
        },
      ],
    } as any;

    setupTest([model, model]);

    expect(dataWithUnreadStatus).toBeNull();
    expect(numUnreadChanges).toBeNull();
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(1);
    unreadService.markPageRead('page:changes', getListPageBody(model, 0));
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(numUnreadChanges).toEqual(0);
  }));

  it ('Marks resurrected items unread again', fakeAsync(() => {
    const model: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:0' },
            ]
          },
        },
      ],
    } as any;
    const model_empty: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
            ]
          },
        },
      ],
    } as any;

    setupTest([model, model_empty, model]);

    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(1);
    unreadService.markPageRead('page:changes', getListPageBody(model, 0));
    tick(1);
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(numUnreadChanges).toEqual(0);
  }));

  it ('Deals with new items', fakeAsync(() => {
    const model_1: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:20' },
            ]
          },
        },
      ],
    } as any;
    const model_2: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:20' },
              { 'viewId': 'mid:30' },
            ]
          },
        },
      ],
    } as any;
    const model_3: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:20' },
              { 'viewId': 'mid:30' },
              { 'viewId': 'mid:10' },
              { 'viewId': 'mid:40' },
            ]
          },
        },
      ],
    } as any;

    setupTest([model_1, model_2, model_3, model_3]);

    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(1);
    unreadService.markPageRead('page:changes', getListPageBody(model_1, 0));
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 0).items[1].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(1);
    unreadService.markPageRead('page:changes', getListPageBody(model_2, 0));
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 0).items[1].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 0).items[2].unread).toBeTruthy();
    expect(getListPageBody(dataWithUnreadStatus, 0).items[3].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(2);
    unreadService.markPageRead('page:changes', getListPageBody(model_3, 0));
    tick(1);
    expect(numUnreadChanges).toEqual(0);
  }));

  it ('Works with multiple pages', fakeAsync(() => {
    const model: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:unicorns',
          'body': {
            'items': [
              { 'viewId': 'mid:magic:0' },
            ]
          },
        },
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'body': {
            'items': [
              { 'viewId': 'mid:change:0' },
              { 'viewId': 'mid:change:1' },
            ]
          },
        },
      ],
    } as any;

    setupTest([model, model, model]);

    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeTruthy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[0].unread).toBeTruthy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[1].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(2);
    unreadService.markPageRead('page:unicorns', getListPageBody(model, 0));
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[0].unread).toBeTruthy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[1].unread).toBeTruthy();
    expect(numUnreadChanges).toEqual(2);
    unreadService.markPageRead('page:changes', getListPageBody(model, 1));
    tick(1);
    expect(getListPageBody(dataWithUnreadStatus, 0).items[0].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[0].unread).toBeFalsy();
    expect(getListPageBody(dataWithUnreadStatus, 1).items[1].unread).toBeFalsy();
    expect(numUnreadChanges).toEqual(0);
  }));
})
