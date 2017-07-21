import { fakeAsync, tick } from '@angular/core/testing';
import {} from 'jasmine';
import { Observable } from 'rxjs/Rx';
import * as TypeMoq from 'typemoq';

import { DataService } from './data.service';
import { FakeLocalDataService } from './local-data.service';
import { UnreadService } from './unread.service';
import { ApplicationViewModel, ListBody } from './viewmodel.types';

describe('UnreadService', () => {
  const mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType<DataService>();

  beforeEach(() => {
    mockDataService.reset();
  });

  it ('Counts unread changes and resets after visiting the page', fakeAsync(() => {
    const pageBody1: ListBody = {
      'title': 'Changes',
      'items': [
        {
          'viewId': 'mid:0',
          'text': 'Foo'
        },
      ]
    };
    const model1: ApplicationViewModel = {
      pages: [
        {
          '__type': 'ListPageViewModel',
          'viewId': 'page:changes',
          'menuTitle': 'Changes',
          'body': pageBody1,
        },
      ],
    };

    const modelsObservable = Observable.interval(1).take(2).map((i) => model1);
    const unreadService = new UnreadService(new FakeLocalDataService(), mockDataService.object);
    mockDataService.setup((x) => x.getData()).returns(() => modelsObservable);
    let numUnreadChanges: number = null;
    unreadService.numUnreadChanges().subscribe((value) => {
      numUnreadChanges = value;
    });
    expect(numUnreadChanges).toBeNull();
    tick(1);
    expect(numUnreadChanges).toEqual(1);
    unreadService.markPageRead('page:changes', pageBody1);
    tick(1);
    expect(numUnreadChanges).toEqual(0);
  }));
})
