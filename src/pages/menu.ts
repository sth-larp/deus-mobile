﻿import { Component, ViewChild } from '@angular/core';

import { DataService } from '../services/data.service';
import { NavController, Nav } from "ionic-angular";
import { Subscription } from "rxjs/Subscription";
import { TechnicalInfoPage } from "./technical-info";
import { ListPage } from "./list";
import { PlainTextPage } from "./plain-text";
import { PlaygroundPage } from "./playground";
import { LoggingService } from "../services/logging.service";

class PageData {
  public root: any;
  // tslint:disable-next-line:variable-name
  public menu_title: string;
}


@Component({
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) private _nav: Nav;

  public pages: Array<PageData> = [{ root: PlaygroundPage, menu_title: "Playground" }];

  private _pageTypeToPage = new Map<string, any>();
  private _subscription: Subscription = null;

  constructor(private _dataService: DataService,
    private _navCtrl: NavController,
    private _logging: LoggingService) {
    this._pageTypeToPage.set('list', ListPage);
    this._pageTypeToPage.set('plain_text', PlainTextPage);
    this._pageTypeToPage.set('technical_info', TechnicalInfoPage);
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(
      json => {
        this.pages = [{ root: PlaygroundPage, menu_title: "Playground" }];
        for (let p of json.pages)
          this.pages.push({ root: this._pageTypeToPage.get(p.page_type), menu_title: p.menu_title });
      },
      error => this._logging.error('JSON parsing error: ' + JSON.stringify((error)))
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
    this._nav.setRoot(page.root, { id: page.menu_title })
      .catch(err => this._logging.error(JSON.stringify(err)));
  }

}
