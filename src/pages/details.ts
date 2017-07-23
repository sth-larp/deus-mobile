import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { QrData } from 'deus-qr-lib/lib/qr';
import { EnhancedActionSheetController, EnhancedAlertController } from '../elements/enhanced-controllers';
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
              private _actionSheetCtrl: EnhancedActionSheetController,
              private _alertController: EnhancedAlertController,
              private _dataService: DataService,
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
            this._qrCodeScanner.observeQrsParsed().then((qrData: QrData) => {
              action.data.additionalQrData = qrData;
              this.pushActionEvent(action);
            })
            .catch(() => {});
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
    this._actionSheetCtrl.show({
      title: '',
      buttons,
    });
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
      this._alertController.show({
        title: 'Подтверждение действия',
        message: `Вы действительно хотите <b>${action.text} ${this.data.header}</b>?`,
        buttons,
      });
    } else {
      this.doPushActionEvent(action);
    }
  }

  private doPushActionEvent(action: ActionData) {
    this._dataService.pushEvent(action.eventType, action.data);
  }
}
