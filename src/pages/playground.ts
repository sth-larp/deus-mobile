import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { TimeService } from '../services/time.service';
import { DataService } from "../services/data.service";
import { QrCodeService } from "../services/qrcode.service";

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  public currentTime: string;
  public username: string;
  constructor(
    private _timeService: TimeService,
    private _dataService: DataService,
    private _qrCodeService: QrCodeService) {
    Observable.timer(0, 10000).forEach(() => this.enqueTimeUpdate());

    this._dataService.getUsername().subscribe(
      (username: string) => this.username = username
    );
  }

  public enqueTimeUpdate(): void {
    console.log('enqueTimeUpdate');
    this._timeService.getTime().subscribe(
      json => this.currentTime = `${json.hours}:${json.minutes}:${json.seconds}`,
      error => console.error('Error: ' + JSON.stringify((error)))
    );
  }

  public scanQRCode(): void {
    this._qrCodeService.scanQRCode();
  }

  public showQRCode(): void {
    this._qrCodeService.showQRCode('access:Some Weird Place');
  }

  public pushEvent(): void {
    this._dataService.pushEvent();
  }
}
