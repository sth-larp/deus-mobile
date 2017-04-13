import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DataService } from "../services/data.service";
import { Subscription } from "rxjs/Rx";
import { LoggingService } from "../services/logging.service";

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class SelectorData {
  public page_type: string;
  public menu_title: string;
  public page_title: string;
  public body: any;
}
// tslint:enable:variable-name

@Component({
  selector: 'page-selector',
  templateUrl: 'selector.html',
})
export class SelectorPage {
  public data = new SelectorData;
  private _title: string;
  private _subscription: Subscription = null;
  constructor(navParams: NavParams,
              private _dataService: DataService,
              private _logging: LoggingService) {
    this._title = navParams.data;
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(json => {
      for (let p of json.pages) {
        if (p.menu_title == this._title) {
          this._logging.debug("Updating page " + JSON.stringify(p));
          this.data = p;
        }
      }
    });
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}
