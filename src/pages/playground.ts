import { Component } from '@angular/core';
import { ModalController, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Rx';

import { TimeService } from '../services/time.service';
import { DataService } from "../services/data.service";
import { AccessPage } from "./access";

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  currentTime: string;
  lastQR: string = '(none)';
  username: string;
  constructor(
    private _app: App,
    private _timeService: TimeService,
    private _barcodeScanner: BarcodeScanner,
    private _dataService: DataService,
    private _modalController: ModalController) {

    Observable.timer(0, 10000).forEach(() => this.enqueTimeUpdate());

    this._dataService.getUsername().subscribe(
      (username: string) => this.username = username
    );
  }

  enqueTimeUpdate(): void {
    console.log('enqueTimeUpdate');
    this._timeService.getTime().subscribe(
      json => this.currentTime = `${json.hours}:${json.minutes}:${json.seconds}`,
      error => console.error('Error: ' + JSON.stringify((error)))
    );
  }

  scanQRCode(): void {
    this._barcodeScanner.scan().then((barcodeData) => {
      console.log('Read QR code: ', barcodeData);
      if (barcodeData['cancelled'])
        this.lastQR = '(cancelled)';
      else
        this.onQRScanned(barcodeData['text']);
    }, (err) => {
      console.log('Error reading QR code: ', err);
    });
  }

  onQRScanned(qr: string) {
    this.lastQR = qr;
    if (qr.startsWith('access:')) {
      let area_name: string = qr.substring(7);
      let accessModal = this._modalController.create(AccessPage, {area_name : area_name});
      accessModal.present();
    }
  }

  showQRCode(): void {
    this._barcodeScanner.encode(this._barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
    .then(success => console.log(success))
    .then(err => console.log(err))
  }


}
