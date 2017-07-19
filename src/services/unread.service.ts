import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LocalDataService } from '../services/local-data.service';
import { ApplicationViewModel, ListBody, ListPageViewModel } from '../services/viewmodel.types';

// "Unread" statuses for items and pages
@Injectable()
export class UnreadService {
  private _numUnreadChangesEventEmitter: EventEmitter<number> = new EventEmitter();
  private _numUnreadChanges: Observable<number>;

  constructor(private _localDataService: LocalDataService) {
  }

  public numUnreadChanges(): Observable<number> {
    return Observable.create((observer) => {
      this._numUnreadChangesEventEmitter.subscribe((value) => {
        observer.next(value);
      });
      return () => { this._numUnreadChangesEventEmitter.unsubscribe(); };
    });
  }

  public async updateUnreadInPage(viewId: string, pageBody: ListBody) {
    let numUnread = 0;
    const storageKey = 'unread/' + viewId;
    const readIdsArray: string[] = await this._localDataService.getItemOrNull(storageKey);
    const readIds: Set<string> = readIdsArray != null ? new Set(readIdsArray) : new Set();
    pageBody.items.forEach((item) => {
      if (item.viewId) {
        item.unread = !readIds.has(item.viewId);
        if (item.unread)
          ++numUnread;
      }
    });
    if (viewId == 'page:changes') {
      this._numUnreadChangesEventEmitter.emit(numUnread);
    }
    // if (viewId == 'page:messages')
    //   TODO: emit unread messaged
  }

  public async updateUnreadInModel(viewModel: ApplicationViewModel) {
    // TODO: Also highlight changes. Use map viewId->revision instead.
    viewModel.numUnreadChanges = 0;
    viewModel.numUnreadMessages = 0;
    await Promise.all(viewModel.pages.map(async (page) => {
      if (page.__type == 'ListPageViewModel') {
        const listPage = page as ListPageViewModel;
        await this.updateUnreadInPage(listPage.viewId, listPage.body);
      }
    }));
  }

  public async markPageRead(viewId: string, pageBody: ListBody) {
    const storageKey = 'unread/' + viewId;
    const modelIds: string[] = [];
    pageBody.items.forEach((item) => {
      if (item.viewId)
        modelIds.push(item.viewId);
    });
    // It's by design that IDs removed from the model are also removed
    // form the list of read. If a condition is removed and then re-added,
    // user should be notified again.
    await this._localDataService.setItem(storageKey, modelIds);
    // Required to update notification icon
    await this.updateUnreadInPage(viewId, pageBody);
  }
}
