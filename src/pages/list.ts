import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, Refresher, Segment } from 'ionic-angular';
import { ListItemData } from '../elements/list-item';
import { DataService } from '../services/data.service';
import { UpdatablePage } from './updatable';

class ListBody {
  public title: string;
  public items: ListItemData[];
  public filters: string[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage extends UpdatablePage {
  public body: ListBody = { title: '', items: [], filters: [] };
  public currentFilter = '';
  public filters: string[] = [];

  @ViewChild(Content) private _content: Content;
  @ViewChild(Segment) private _segment: Segment;

  constructor(dataService: DataService, navCtrl: NavController, navParams: NavParams) {
    super(navParams.data.id, dataService, navCtrl);
  }

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this._dataService.trySendEvents()
    .then(() => refresher.complete())
    .catch(() => refresher.complete());
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
