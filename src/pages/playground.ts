import { Component } from '@angular/core';

import { DataService } from "../services/data.service";
import { QrCodeScanService } from "../services/qrcode-scan.service";
import { ModalController } from "ionic-angular";
import { ViewQrCodePage } from "./view-qrcode";

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  public currentTime: string;
  public username: string;
  constructor(
    private _dataService: DataService,
    private _qrCodeScanService: QrCodeScanService,
    private _modalController: ModalController) {
    this.username = this._dataService.getUsername();
  }

  public scanQRCode(): void {
    this._qrCodeScanService.scanQRCode();
  }

  public showQRCode(): void {
    let accessModal = this._modalController.create(ViewQrCodePage, { value : 'access:Some Weird Place' });
    accessModal.present();
  }

  public pushEvent(): void {
    this._dataService.pushEvent();
  }
}
