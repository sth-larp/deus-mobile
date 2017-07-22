import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EventEmitter } from 'events';
import { LocalDataService } from '../services/local-data.service';
import { ApplicationViewModel, ListBody, ListPageViewModel } from '../services/viewmodel.types';
import { DataService } from './data.service';

// "Unread" statuses for items and pages
@Injectable()
export class UnreadService {
  private _storageKey = 'readViedId';
  private _readStatusChangeEmitter = new EventEmitter();

  constructor(private _localDataService: LocalDataService,
              private _dataService: DataService) {
  }

  public async markPageRead(pageId: string, pageBody: ListBody) {
    const currentReadViewIds = await this.getReadViewIds();
    const modelIds = pageBody.items.filter((item) => item.viewId).map((item) => item.viewId);
    // It's by design that IDs removed from the model are also removed
    // from the list of read. If a condition is removed and then re-added,
    // user should be notified again.
    currentReadViewIds[pageId] = modelIds;
    this._readStatusChangeEmitter.emit('change', currentReadViewIds);
    await this._localDataService.setItem(this._storageKey, currentReadViewIds);
  }

  public getDataWithUnreadStatus(): Observable<ApplicationViewModel> {
    return Observable.combineLatest(this._dataService.getData(),
      this.observeReadViewIds(),
      (appViewModel: ApplicationViewModel, readViewIds: any) => this.updateUnreadInModel(appViewModel, readViewIds));
  }

  public numUnreadChanges(): Observable<number> {
    return this.getDataWithUnreadStatus().map((appViewModel: ApplicationViewModel) => {
      const changesPages = appViewModel.pages.filter((page) => page.viewId == 'page:changes');
      if (changesPages.length != 1) return 0;
      const changesPage = (changesPages[0] as ListPageViewModel);
      return changesPage.body.items.filter((item) => item.unread).length;
    });
  }

  private observeReadViewIds(): Observable<any> {
    return Observable.fromPromise(this.getReadViewIds())
    .concat(Observable.fromEvent(this._readStatusChangeEmitter, 'change', (v) => v));
  }

  private async getReadViewIds(): Promise<any> {
    let currentReadViewIds = await this._localDataService.getItemOrNull(this._storageKey);
    if (!currentReadViewIds) currentReadViewIds = {};
    return currentReadViewIds;
  }

  private updateUnreadInModel(viewModel: ApplicationViewModel, readStatusData: any) {
    // TODO: Also highlight changes. Use map viewId->revision instead.
    viewModel.pages.forEach((page) => {
      if (page.__type == 'ListPageViewModel') {
        const listPage = page as ListPageViewModel;
        const readIdsOnPage: string[] = (readStatusData && readStatusData[listPage.viewId])
        ? readStatusData[listPage.viewId] : [];
        this.updateUnreadInPage(listPage.body, readIdsOnPage);
      }
    });
    return viewModel;
  }

  private updateUnreadInPage(pageBody: ListBody, readIdsOnPageArray: string[]) {
    const readIds: Set<string> = new Set(readIdsOnPageArray);

    pageBody.items.forEach((item) => {
      if (item.viewId) {
        item.unread = !readIds.has(item.viewId);
      }
    });
  }
}
