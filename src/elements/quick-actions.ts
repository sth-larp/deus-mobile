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
  
  private _subscription: Subscription = null;

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
    this._subscription = this._dataService.getData().subscribe(
      // TODO(Andrei): Rework hitpoints indicator and remove Math.min
      // (or make sure that it's NEVER possible to get > 5 hp).
      json => { this.hitPoints = Math.min(5, json.toolbar.hitPoints);  this._logging.debug('HIT POINTS: ' + this.hitPoints); },
      error => this._logging.error('JSON parsing error: ' + JSON.stringify(error))
    );
  }

  private ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  public onBarcode() {
    this._qrCodeScanService.scanQRCode();
  }

  public onRefresh() {
    this._dataService.pushRefreshModelEvent().then(() => {
      this._dbConnectionService.forceSync();
    });
  }

  public onId() {
    let accessModal = this._modalController.create(ViewQrCodePage,
      { value: `character:${this._dataService.getUsername()}` });
    accessModal.present();
  }
}
