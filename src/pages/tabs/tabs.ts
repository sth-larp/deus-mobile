import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { PlaygroundPage } from '../playground/playground';
import { SelectorPage, SelectorData } from '../selector/selector';

import { DataService } from '../../services/data-service';

class TabData {
  root: any;
  title: string;
  icon: string;
}

class SelectorTabData {
  root: any;
  title: string;
  icon: string;
  data: SelectorData;
}


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab5Root: any = SelectorPage;

  fixed_tabs : Array<TabData> = [
    {
      root: HomePage,
      title: "Home",
      icon: "information-circle"
    },
    {
      root: AboutPage,
      title: "About",
      icon: "information-circle"
    },
    {
      root: ContactPage,
      title: "Contact",
      icon: "information-circle"
    },
    {
      root: PlaygroundPage,
      title: "Playground",
      icon: "information-circle"
    },
  ];

  selector_tabs : Array<SelectorTabData> = [];

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
