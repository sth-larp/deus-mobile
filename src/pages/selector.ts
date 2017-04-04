import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class SelectorData {
  page_type: string;
  page_title: string;
  tab_label: string;
  tab_icon: string;
  body: any;
}
// tslint:enable:variable-name

@Component({
  selector: 'page-selector',
  templateUrl: 'selector.html',
})
export class SelectorPage {
  data: SelectorData;

  constructor(navParams: NavParams) {
    this.data = navParams.data;
  }
}
