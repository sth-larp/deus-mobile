import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LocalDataService } from '../services/local-data.service';
import { ApplicationViewModel, ListBody, ListPageViewModel } from '../services/viewmodel.types';
import { DataService } from './data.service';

// "Unread" statuses for items and pages
@Injectable()
export class UnreadService {
  private _numUnreadChangesEventEmitter: EventEmitter<number> = new EventEmitter();
  private _numUnreadChanges: Observable<number>;

  constructor(private _localDataService: LocalDataService,
              private _dataService: DataService) {
  }

  public async markPageSeen(viewId: string, pageBody: ListBody) {
    const storageKey = 'unread/' + viewId;
    const modelIds = pageBody.items.filter((item) => item.viewId).map((item) => item.viewId);

    // It's by design that IDs removed from the model are also removed
    // from the list of read. If a condition is removed and then re-added,
    // user should be notified again.
    await this._localDataService.setItem(storageKey, modelIds);
  }

  public async markPageRead(viewId: string, pageBody: ListBody) {
    const storageKey = 'unread/' + viewId;
    const modelIds = pageBody.items.filter((item) => item.viewId).map((item) => item.viewId);

    // It's by design that IDs removed from the model are also removed
    // from the list of read. If a condition is removed and then re-added,
    // user should be notified again.
    await this._localDataService.setItem(storageKey, modelIds);
  }

  public numUnreadChanges(): Observable<number> {
    return this.getDataWithUnreadStatus().map((appViewModel: ApplicationViewModel) => {
      const changesPages = appViewModel.pages.filter((page) => page.viewId == 'page:changes');
      if (changesPages.length != 1) return 0;
      const changesPage = (changesPages[0] as ListPageViewModel);
      return changesPage.body.items.filter((item) => item.unread).length;
    });
  }

  public getDataWithUnreadStatus(): Observable<ApplicationViewModel> {
    return this._dataService.getData().concatMap(
      (appViewModel: ApplicationViewModel) => this.updateUnreadInModel(appViewModel));
  }

  private async updateUnreadInModel(viewModel: ApplicationViewModel) {
    // TODO: Also highlight changes. Use map viewId->revision instead.
    viewModel.numUnreadChanges = 0;
    viewModel.numUnreadMessages = 0;
    await Promise.all(viewModel.pages.map(async (page) => {
      if (page.__type == 'ListPageViewModel') {
        const listPage = page as ListPageViewModel;
        await this.updateUnreadInPage(listPage.viewId, listPage.body);
      }
    }));
    return viewModel;
  }

  private async updateUnreadInPage(viewId: string, pageBody: ListBody) {
    const storageKey = 'unread/' + viewId;
    const readIdsArray: string[] = await this._localDataService.getItemOrNull(storageKey);
    const readIds: Set<string> = readIdsArray ? new Set(readIdsArray) : new Set();

    pageBody.items.forEach((item) => {
      if (item.viewId) {
        item.unread = !readIds.has(item.viewId);
      }
    });
  }
}
