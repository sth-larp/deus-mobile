import { Component } from '@angular/core';
import { ActionSheetController, Config, NavController, NavParams, Platform } from 'ionic-angular';

import { QrData } from 'deus-qr-lib/lib/qr';
import { fixActionSheetTransitions } from '../elements/deus-alert-transitions';
import { DataService } from '../services/data.service';
import { QrCodeScanServiceCustom } from '../services/qrcode-scan.service';
import { DetailsData } from '../services/viewmodel.types';

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
              private _config: Config,
              private _qrCodeScanner: QrCodeScanServiceCustom) {
    this.data = navParams.data.value;
  }

  public showActions() {
    const buttons = [];
    for (const action of this.data.actions) {
      buttons.push({
        text: action.text,
        handler: () => {
          if (action.needsQr) {
            this._qrCodeScanner.eventEmitter.subscribe((qrData: QrData) => {
              action.data.additionalQrData = qrData;
              this._dataService.pushEvent(action.eventType, action.data);
            });
            this._qrCodeScanner.scanQRCode();
          } else {
            this._dataService.pushEvent(action.eventType, action.data);
          }
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

  private preprocessText() {
    // TODO(Andrei): Sanitize HTML.
    // TODO(Andrei): Highlight links only when necessary.
    //const urlRegexp = /\b(https?:\/\/\S+)\b/g;
    //this.data.text = this.data.text.replace(urlRegexp, '<a href="$1">$1</a>');
  }
}
