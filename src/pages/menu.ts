import { Component, ViewChild } from '@angular/core';

import { HomePage } from './home';
import { SelectorPage, SelectorData } from './selector';

import { DataService } from '../services/data.service';
import { NavController, Nav } from "ionic-angular";

class MenuElementData {
  public root: any;
  public title: string;
  public icon: string;
  public data: SelectorData;
}

@Component({
  templateUrl: 'menu.html'
})
export class MenuPage {
  public fixedTabs : Array<MenuElementData> = [
    {
      root: HomePage,
      title: "Home",
      icon: "information-circle",
      data: new SelectorData
    }
  ];

  public selectorTabs : Array<MenuElementData> = [];

  @ViewChild(Nav) private _nav: Nav;

  constructor(private _dataService: DataService, private _navCtrl: NavController) {
    this._dataService.getData().subscribe(
      json => {
        for (var page of json.pages) {
          this.selectorTabs.push({
            root: SelectorPage,
            title: page.tab_title,
            icon: page.tab_icon,
            data: page
          })
        }
      },
      error => console.error('SelectorPage JSON parsing error: ' + JSON.stringify((error)))
    );
  }

  public openPage(page) {
    this._nav.setRoot(page.root, page.data);
  }
}
