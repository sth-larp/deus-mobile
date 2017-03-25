import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

export class SelectorData {
  page_type: string;
  page_title: string;
  tab_label: string;
  tab_icon: string;
  body: any;
}

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
