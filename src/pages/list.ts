import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, Refresher, Segment, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { ListBody, PageViewModel } from '../services/viewmodel.types';

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  constructor(protected _title: string,
              protected _dataService: DataService,
              protected _navCtrl: NavController) {
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe((json) => {
      const thisPageData = json.pages.find((p: PageViewModel) => p.menuTitle == this._title);
      if (thisPageData)
        this.setBody((thisPageData as any).body);
      else {
        console.error('ААААААА');
        this._navCtrl.setRoot(ListPage, {id: 'Общая информация'});
      }
    });
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  protected abstract setBody(body: any);
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage extends UpdatablePage {
  public body: ListBody = { pageId: '', title: '', items: [], filters: [] };
  public currentFilter = '';
  public filters: string[] = [];
  // TODO: Highlight pages that has unread item in the menu
  public hasUnread: boolean = false;

  @ViewChild(Content) private _content: Content;
  @ViewChild(Segment) private _segment: Segment;

  constructor(dataService: DataService,
              navCtrl: NavController,
              navParams: NavParams,
              private _localDataService: LocalDataService,
              private _toastCtrl: ToastController) {
    super(navParams.data.id, dataService, navCtrl);
  }

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this._dataService.trySendEvents()
    .then(() => refresher.complete())
    .catch(() => {
      refresher.complete();
      this._toastCtrl.create({
        message: 'Ошибка обращения к серверу, повторите попытку позже',
        duration: 3000,
      }).present();
    });
  }

  public onFilter(filter: string) {
    this.currentFilter = filter;
  }

  protected setBody(body: any) {
    // If any of items has icon, we want to shift all of them
    // by setting hasIcon to every one of them.
    this.body = body;
    const hasIcon = this.body.items.some((item) => item.icon && item.icon.length > 0);
    this.body.items.forEach((item) => item.hasIcon = hasIcon);
    this.updateUnread();

    // Dark magic to fix dynamic header height.
    // See https://github.com/driftyco/ionic/issues/9709
    this._content.resize();

    // Dark magic to fix dynamic ion-segment items.
    // See https://github.com/driftyco/ionic/issues/6923
    setTimeout(() => {
      if (this._segment) {
        this._segment.ngAfterViewInit();
      }
    });
  }

  private async updateUnread() {
    this.hasUnread = false;
    // TODO: Also highlight changes. Use map vid->revision instead.
    const pageId = this.body.pageId;
    const storageKey = 'unread/' + pageId;
    const readIdsArray: string[] = await this._localDataService.getItemOrNull(storageKey);
    const readIds: Set<string> = readIdsArray != null ? new Set(readIdsArray) : new Set();
    const modelIds: string[] = [];
    this.body.items.forEach((item) => {
      if (item.vid) {
        modelIds.push(item.vid);
        if (!readIds.has(item.vid)) {
          item.unread = true;
          this.hasUnread = true;
        }
      }
      // item.unread = (Math.random() > 0.5);  // for UI testing
    });
    // It's by design that IDs removed from the model are also removed
    // form the list of read. If a condition is removed and then re-added,
    // user should be notified again.
    this._localDataService.setItem(storageKey, modelIds);
  }
}

