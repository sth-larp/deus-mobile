import { Component } from '@angular/core';
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
  public email: ListItemData;
  public corporation: ListItemData;
  public insurance: ListItemData;

  public qrContent = '';

  constructor(navParams: NavParams,
              private _clock: MonotonicTimeService) {
    const passportScreenData = navParams.data.value as PassportScreenViewModel;
    this.id = {text: 'ID', value: passportScreenData.id };
    this.fullName = {text: 'Имя', value: passportScreenData.fullName };
    this.email = {text: 'e-mail', value: passportScreenData.email };
    this.corporation = {text: 'Работа', value: passportScreenData.corporation || '' };
    this.insurance = {text: 'Страховка', value: passportScreenData.insurance || ''};

    this.qrContent = encode({
      type: QrType.Passport, kind: 0,
      // TODO: add helper for expiring QR generation
      validUntil: (_clock.getUnixTimeMs() + GlobalConfig.passportQrLifespan) / 1000,
      payload: passportScreenData.id,
    });
  }
}
