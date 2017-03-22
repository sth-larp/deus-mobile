import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SelectorPage, SelectorData } from '../selector/selector';

import { DataService } from '../../services/data.service';

class TabData {
  root: any;
  title: string;
  icon: string;
  data: SelectorData;
}

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  fixed_tabs : Array<TabData> = [
    {
      root: HomePage,
      title: "Home",
      icon: "information-circle",
      data: new SelectorData
    }
  ];

  selector_tabs : Array<TabData> = [];

  constructor(private _dataService: DataService) {
    this._dataService.getData().subscribe(
      json => {
        for (var page of json.pages) {
          this.selector_tabs.push({
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
}
