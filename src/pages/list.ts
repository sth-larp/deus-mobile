import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, Refresher, Segment, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { UnreadService } from '../services/unread.service';
import { ListBody, PageViewModel } from '../services/viewmodel.types';

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  constructor(protected _viewId: string,
              protected _unreadService: UnreadService,
              protected _navCtrl: NavController) {
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._unreadService.getDataWithUnreadStatus().subscribe((json) => {
      const thisPageData = json.pages.find((p: PageViewModel) => p.viewId == this._viewId);
      if (thisPageData)
        this.setBody((thisPageData as any).body);
      else {
        this._navCtrl.setRoot(ListPage, {id: 'page:general'});
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
  public body: ListBody = { title: '', items: [], filters: [] };
  public currentFilter = '';
  public filters: string[] = [];
  // TODO: Highlight pages that has unread item in the menu
  public hasUnread: boolean = false;

  @ViewChild(Content) private _content: Content;
  @ViewChild(Segment) private _segment: Segment;

  constructor(private _dataService: DataService,
              navCtrl: NavController,
              navParams: NavParams,
              private _localDataService: LocalDataService,
              protected _unreadService: UnreadService,
              private _toastCtrl: ToastController) {
    super(navParams.data.id, _unreadService, navCtrl);
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillLeave() {
    this._unreadService.markPageRead(this._viewId, this.body);
  }

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this._dataService.trySendEvents()
    .then(() => {
      refresher.complete();
      this._toastCtrl.create({
        message: 'Данные успешно обновлены',
        duration: 2000,
      }).present();
    })
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
    this.body = body;
    // If any of items has icon, we want to shift all of them
    // by setting hasIcon to every one of them.
    const hasIcon = this.body.items.some((item) => item.icon && item.icon.length > 0);
    this.body.items.forEach((item) => item.hasIcon = hasIcon);

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
}
