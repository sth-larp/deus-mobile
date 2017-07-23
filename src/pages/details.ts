import { Component } from '@angular/core';
import { ActionSheetController, AlertController, Config,
  NavController, NavParams, Platform } from 'ionic-angular';

import { QrData } from 'deus-qr-lib/lib/qr';
import { fixActionSheetTransitions, fixAlertTransitions } from '../elements/deus-alert-transitions';
import { DataService } from '../services/data.service';
import { QrCodeScanServiceCustom } from '../services/qrcode-scan.service';
import { ActionData, DetailsData } from '../services/viewmodel.types';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  public data: DetailsData;
  constructor(navParams: NavParams,
              private _navCtrl: NavController,
              private _actionSheetCtrl: ActionSheetController,
              private _alertController: AlertController,
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
        cssClass: action.destructive ? 'destructive-button' : null,
        handler: () => {
          if (action.needsQr) {
            this._qrCodeScanner.eventEmitter.subscribe((qrData: QrData) => {
              action.data.additionalQrData = qrData;
              this.pushActionEvent(action);
            });
            this._qrCodeScanner.scanQRCode();
          } else {
            this.pushActionEvent(action);
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

  private pushActionEvent(action: ActionData) {
    if (action.destructive) {
      const buttons = [{
        text: 'Отмена',
        role: 'cancel',
      },
      {
        text: action.text,
        cssClass: 'destructive-button',
        handler: () => this.doPushActionEvent(action),
      }];
      const alert = this._alertController.create({
        title: 'Подтверждение действия',
        message: `Вы действительно хотите <b>${action.text} ${this.data.header}</b>?`,
        buttons,
      });

      fixAlertTransitions(this._config);

      const unregisterFn = this._platform.registerBackButtonAction(() => {
        alert.dismiss();
      }, 0);
      alert.onWillDismiss(unregisterFn);
      alert.present();
    } else {
      this.doPushActionEvent(action);
    }
  }

  private doPushActionEvent(action: ActionData) {
    this._dataService.pushEvent(action.eventType, action.data);
  }
}
