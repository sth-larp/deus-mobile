import { DataService } from "../services/data.service";
import { Subscription } from "rxjs/Rx";

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class UpdatablePageData {
  public page_type: string;
  public menu_title: string;
  public body: any;
}
// tslint:enable:variable-name

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  constructor(private _title: string,
              private _dataService: DataService) {
  }

  protected abstract setBody(body: any);

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(json => {
      const pagesTyped: Array<UpdatablePageData> = json.pages;
      const thisPageData = pagesTyped.find((p: UpdatablePageData) => p.menu_title == this._title);
      if (thisPageData)
        this.setBody(thisPageData.body);
    });
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}
