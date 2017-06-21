import { Component } from '@angular/core';
import { NavParams, ActionSheetController, NavController, Platform } from "ionic-angular";
import { DataService } from "../services/data.service";

export class ActionData {
  public text: string;
  public eventType: string;
  public data: any;
}

export class DetailsData {
  public header: string;
  public text: string;
  public actions: Array<ActionData>;
}

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  public data: DetailsData;
  constructor(navParams: NavParams,
    private _navCtrl: NavController,
    private _actionSheetCtrl: ActionSheetController,
    private _dataService: DataService,
    private _platform: Platform) {
    this.data = navParams.data.value;
  }

  public showActions() {
    let buttons = [];
    for (let action of this.data.actions) {
      buttons.push({
        text: action.text,
        handler: () => {
          this._dataService.pushEvent(action.eventType, action.data);
          this._navCtrl.pop();
        }
      });
    }
    buttons.push({
          text: 'Cancel',
          role: 'cancel'
        })
    let actionSheet = this._actionSheetCtrl.create({
      title: '',
      buttons: buttons
    });

    let unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present()
  }
}
