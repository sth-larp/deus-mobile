import { Component } from '@angular/core';
import { QrData } from 'deus-qr-lib';
import { NavParams } from 'ionic-angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'page-general-qrcode',
  templateUrl: 'general-qrcode.html',
})
export class GeneralQRCodePage {
  public data: QrData;
  constructor(navParams: NavParams,
              dataService: DataService) {
    this.data = navParams.data.value;
    dataService.pushEvent('scanQr', this.data);
  }
}
