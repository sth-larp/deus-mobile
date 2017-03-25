import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Rx';

import { TimeService } from '../../time/time.service';
import { DataService } from "../../services/data.service";
import { LoginPage } from "../login/login";

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
    private _dataService: DataService) {

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
        this.lastQR = barcodeData['text'];
    }, (err) => {
      console.log('Error reading QR code: ', err);
    });
  }

  logout() {
    this._dataService.logout();
    this._app.getRootNav().setRoot(LoginPage);
  }
}
