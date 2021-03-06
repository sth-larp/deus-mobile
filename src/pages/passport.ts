import { Component } from '@angular/core';
import { Brightness } from '@ionic-native/brightness';
import { encode } from 'deus-qr-lib/lib/qr';
import { QrType } from 'deus-qr-lib/lib/qr.type';
import { NavParams } from 'ionic-angular';
import { GlobalConfig } from '../config';
import { MonotonicTimeService } from '../services/monotonic-time.service';
import { ListItemData, PassportScreenViewModel } from '../services/viewmodel.types';

@Component({
  selector: 'page-passport',
  templateUrl: 'passport.html',
})
export class PassportPage {
  public id: ListItemData;
  public fullName: ListItemData;
  public corporation: ListItemData;

  public qrContent = '';

  constructor(navParams: NavParams,
              private _clock: MonotonicTimeService,
              private _brightness: Brightness) {
    const passportScreenData = navParams.data.value as PassportScreenViewModel;
    this.id = {text: 'ID', value: passportScreenData.id };
    this.fullName = {text: 'Имя', value: passportScreenData.fullName };
    this.corporation = {text: 'Работа', value: passportScreenData.corporation || '' };

    this.qrContent = encode({
      type: QrType.Passport, kind: 0,
      // TODO: add helper for expiring QR generation
      validUntil: (_clock.getUnixTimeMs() + GlobalConfig.passportQrLifespan) / 1000,
      payload: passportScreenData.id,
    });
  }

  public ionViewDidEnter() {
    this._brightness.setBrightness(1);
    this._brightness.setKeepScreenOn(true);
  }

  public ionViewWillLeave() {
    this._brightness.setBrightness(-1);
    this._brightness.setKeepScreenOn(false);
  }
}
