import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";

import { DataService } from '../services/data.service';
import { TechnicalInfoPage } from "./technical-info";
import { ListPage } from "./list";
import { PlainTextPage } from "./plain-text";
import { EconomyPage } from "./economy";
import { PlaygroundPage } from "./playground";
import { LoggingService } from "../services/logging.service";
import { LoginPage } from "./login";

class PageData {
  public root: any;
  // tslint:disable-next-line:variable-name
  public menuTitle: string;
}


@Component({
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) private _nav: Nav;

  public pages: Array<PageData> = [{ root: PlaygroundPage, menuTitle: "Playground" }];

  private _pageTypeToPage = new Map<string, any>();
  private _subscription: Subscription = null;

  constructor(private _dataService: DataService,
    private _navCtrl: NavController,
    private _logging: LoggingService) {
    this._pageTypeToPage.set('list', ListPage);
    this._pageTypeToPage.set('plain_text', PlainTextPage);
    this._pageTypeToPage.set('economy', EconomyPage);
    this._pageTypeToPage.set('technical_info', TechnicalInfoPage);
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(
      json => {
        this.pages = [{ root: PlaygroundPage, menuTitle: "Playground" }];
        for (let p of json.pages)
          this.pages.push({ root: this._pageTypeToPage.get(p.pageType), menuTitle: p.menuTitle });
      },
      error => this._logging.error('JSON parsing error: ' + JSON.stringify(error))
    );
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  public openPage(page: PageData) {
    this._nav.setRoot(page.root, { id: page.menuTitle })
      .catch(err => this._logging.error(JSON.stringify(err)));
  }

  public getCharacterName() {
    return this._dataService.getUsername();
  }

  public logout() {
    this._dataService.logout();
    this._navCtrl.setRoot(LoginPage);
  }
}
