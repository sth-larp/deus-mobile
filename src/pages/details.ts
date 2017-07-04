import { Component } from '@angular/core';
import { ActionSheetController, Config, NavController, NavParams, Platform } from 'ionic-angular';

import { fixActionSheetTransitions } from '../elements/deus-alert-transitions';
import { DataService } from '../services/data.service';

export class ActionData {
  public text: string;
  public eventType: string;
  public data: any;
}

export class DetailsData {
  public header: string;
  public text: string;
  public actions: ActionData[];
}

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  public data: DetailsData;
  constructor(navParams: NavParams,
              private _navCtrl: NavController,
              private _actionSheetCtrl: ActionSheetController,
              private _dataService: DataService,
              private _platform: Platform,
              private _config: Config) {
    this.data = navParams.data.value;
  }

  public showActions() {
    const buttons = [];
    for (const action of this.data.actions) {
      buttons.push({
        text: action.text,
        handler: () => {
          this._dataService.pushEvent(action.eventType, action.data);
          this._navCtrl.pop();
        },
      });
    }
    buttons.push({
          text: 'Отмена',
          role: 'cancel',
        });
    const actionSheet = this._actionSheetCtrl.create({
      title: '',
      buttons,
    });

    fixActionSheetTransitions(this._config);

    const unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present();
  }
}
