import { Component } from '@angular/core';

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
    private _dataService: DataService,
    private _qrCodeService: QrCodeService) {
    this._dataService.getUsername().subscribe(
      (username: string) => this.username = username
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
