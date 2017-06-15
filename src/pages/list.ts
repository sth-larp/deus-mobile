import { Component, ViewChild } from '@angular/core';
import { NavParams, Content, Segment, NavController, Refresher } from "ionic-angular";
import { ListItemData } from '../elements/list-item';
import { UpdatablePage } from "./updatable";
import { DataService } from "../services/data.service";

class ListBody {
  public title: string;
  public items: ListItemData[];
  public filters: Array<string>;
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage extends UpdatablePage {
  @ViewChild(Content) public _content: Content;
  @ViewChild(Segment) private _segment: Segment;

  public body: ListBody = { title: "", items: [], filters: [] };
  public currentFilter = "";
  public filters: Array<string> = [];

  constructor(dataService: DataService, navCtrl: NavController, navParams: NavParams) {
    super(navParams.data.id, dataService, navCtrl);
  }

  protected setBody(body: any) {
    // If any of items has icon, we want to shift all of them
    // by setting hasIcon to every one of them.
    this.body = body;
    const hasIcon = this.body.items.some(item => { return item.icon && item.icon.length > 0; });
    this.body.items.forEach(item => item.hasIcon = hasIcon);

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

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this._dataService.trySendEvents()
    .then(() => refresher.complete())
    .catch(() => refresher.complete());
  }

  public onFilter(filter: string) {
    this.currentFilter = filter;
  }
}
