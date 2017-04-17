import { DataService } from "../services/data.service";
import { Subscription } from "rxjs/Rx";
import { LoggingService } from "../services/logging.service";

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class UpdatablePageData {
  public page_type: string;
  public menu_title: string;
  public page_title: string;
  public body: any;
}
// tslint:enable:variable-name

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  public pageTitle: string;
  constructor(private _title: string,
              private _dataService: DataService,
              private _logging: LoggingService) {
  }

  protected abstract setBody(body: any);

  // tslint:disable-next-line:no-unused-variable
  private ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(json => {
      for (const p of json.pages) {
        const pTyped: UpdatablePageData = p;
        if (pTyped.menu_title == this._title) {
          this.setBody(p.body);
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
