import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class SelectorData {
  public page_type: string;
  public page_title: string;
  public tab_label: string;
  public tab_icon: string;
  public body: any;
}
// tslint:enable:variable-name

@Component({
  selector: 'page-selector',
  templateUrl: 'selector.html',
})
export class SelectorPage {
  public data: SelectorData;

  constructor(navParams: NavParams) {
    this.data = navParams.data;
  }
}
