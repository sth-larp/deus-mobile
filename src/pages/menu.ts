import { Component, ViewChild } from '@angular/core';

import { HomePage } from './home';
import { SelectorPage } from './selector';

import { DataService } from '../services/data.service';
import { NavController, Nav } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";

class FixedPageData {
  public root: any;
  // tslint:disable-next-line:variable-name
  public menu_title: string;
}

class SelectorPageData {
  // tslint:disable-next-line:variable-name
  public menu_title: string;
}


@Component({
  templateUrl: 'menu.html'
})
export class MenuPage {

  private _subscription: Subscription = null;

  public fixedPages: Array<FixedPageData> = [{ root: HomePage, menu_title: "Home" }];
  public selectorPages = new Array<SelectorPageData>();

  private _selectorPage = SelectorPage;

  @ViewChild(Nav) private _nav: Nav;

  constructor(private _dataService: DataService, private _navCtrl: NavController) {}

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(
      json => {
        this.selectorPages = [];
        for (let p of json.pages)
          this.selectorPages.push({ menu_title: p.menu_title });
      },
      error => console.error('SelectorPage JSON parsing error: ' + JSON.stringify((error)))
    );
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  public openFixedPage(page) {
    this._nav.setRoot(page);
  }

  public openSelectorPage(title: string) {
    this._nav.setRoot(this._selectorPage, title);
  }

}
