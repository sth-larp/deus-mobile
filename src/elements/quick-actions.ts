import { DbConnectionService, UpdateStatus } from '../services/db-connection.service';
import { Component } from '@angular/core';
import { ModalController } from "ionic-angular";
import { ViewQrCodePage } from "../pages/view-qrcode";
import { QrCodeScanService } from "../services/qrcode-scan.service";
import { DataService } from "../services/data.service";

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html'
})
export class QuickActions {
  public updateStatus: string = "Red";

  constructor(private _modalController: ModalController,
    private _qrCodeScanService: QrCodeScanService,
    private _dataService: DataService,
    private _dbConnectionService: DbConnectionService) {
    _dbConnectionService.getUpdateStatus().subscribe(
      status => { this.updateStatus = UpdateStatus[status]; },
      error => console.error('Cannot get update status: ' + error))
  }

  public onBarcode() {
    this._qrCodeScanService.scanQRCode();
  }

  public onRefresh() {
    this._dbConnectionService.forceSync();
  }

  public onId() {
    let accessModal = this._modalController.create(ViewQrCodePage,
      { value: `character:${this._dataService.getUsername()}` });
    accessModal.present();
  }
}
