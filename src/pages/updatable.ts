import { DataService } from "../services/data.service";
import { Subscription } from "rxjs/Rx";
import { NavController } from "ionic-angular";
import { PlaygroundPage } from "./playground";

// Needs to be in sync with json, which uses snake case.
// tslint:disable:variable-name
export class UpdatablePageData {
  public pageType: string;
  public menuTitle: string;
  public body: any;
}
// tslint:enable:variable-name

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  constructor(private _title: string,
              private _dataService: DataService,
              private _navCtrl: NavController) {
  }

  protected abstract setBody(body: any);

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(json => {
      const pagesTyped: Array<UpdatablePageData> = json.pages;
      const thisPageData = pagesTyped.find((p: UpdatablePageData) => p.menuTitle == this._title);
      if (thisPageData)
        this.setBody(thisPageData.body);
      else {
        this._navCtrl.setRoot(PlaygroundPage)
      }
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
