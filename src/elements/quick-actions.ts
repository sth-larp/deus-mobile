import { Component } from '@angular/core';
import { ModalController } from "ionic-angular";
import { Subscription } from "rxjs";

import { DbConnectionService, UpdateStatus } from '../services/db-connection.service';
import { ViewQrCodePage } from "../pages/view-qrcode";
import { QrCodeScanService } from "../services/qrcode-scan.service";
import { DataService } from "../services/data.service";
import { LoggingService } from "../services/logging.service";

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html'
})
export class QuickActions {
  public updateStatus: string = "Red";
  public hitPoints: number = 0;

  constructor(private _modalController: ModalController,
    private _qrCodeScanService: QrCodeScanService,
    private _dataService: DataService,
    private _dbConnectionService: DbConnectionService,
    private _logging: LoggingService) {
    _dbConnectionService.getUpdateStatus().subscribe(
      status => { this.updateStatus = UpdateStatus[status]; },
      error => console.error('Cannot get update status: ' + error))
  }

  private ngOnInit() {
    // TODO: Do we need to unsubscribe?
    this._dataService.getData().subscribe(
      json => { this.hitPoints = json.toolbar.hit_points;  this._logging.debug('HIT POINTS: ' + this.hitPoints); },
      error => this._logging.error('JSON parsing error: ' + JSON.stringify(error))
    );
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
