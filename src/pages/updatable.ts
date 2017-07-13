import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { DataService } from '../services/data.service';
import { PageViewModel } from '../services/viewmodel.types';

export abstract class UpdatablePage {
  private _subscription: Subscription = null;
  constructor(protected _title: string,
              protected _dataService: DataService,
              protected _navCtrl: NavController) {
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe((json) => {
      const thisPageData = json.pages.find((p: PageViewModel) => p.menuTitle == this._title);
      if (thisPageData)
        this.setBody((thisPageData as any).body);
      else {
        // this._navCtrl.setRoot(ListPage);
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

  protected abstract setBody(body: any);
}
