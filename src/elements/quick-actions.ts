import { Component } from '@angular/core';
import { ModalController } from "ionic-angular";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";

import { ViewQrCodePage } from "../pages/view-qrcode";
import { QrCodeScanService } from "../services/qrcode-scan.service";
import { DataService, UpdateStatus } from "../services/data.service";
import { LocalDataService } from "../services/local-data.service";
import { LoggingService } from "../services/logging.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html'
})
export class QuickActions {
  public updateStatusIcon: string = null;
  public hitPoints: number = 0;
  public hitPointsText: string = null;
  public hitPointsIcon: string = null;
  public vrIcon: string = null;
  public vrTimer: string = null;

  private _subscription: Subscription = null;

  constructor(private _modalController: ModalController,
    private _qrCodeScanService: QrCodeScanService,
    private _dataService: DataService,
    private _localDataService: LocalDataService,
    private _authService: AuthService,
    private _logging: LoggingService) {
    _dataService.getUpdateStatus().subscribe(
      status => { this.updateStatusIcon = this.getUpdateStatusIcon(status); },
      error => console.error('Cannot get update status: ' + error))
  }

  private ngOnInit() {
    this._subscription = this._dataService.getData().subscribe(
      json => {
        this.hitPoints = json.toolbar.hitPoints;
        // TODO(Andrei): Add more icon gradations
        this.hitPointsIcon = this.hitPoints == 0
                                 ? 'hit-points-0.svg'
                                 : 'hit-points-full.svg';
        // TODO(Andrei): Show mapHP
        this.hitPointsText = this.hitPoints + '/?'
      },
      error => this._logging.error('JSON parsing error: ' + JSON.stringify(error))
    );
    setInterval(() => { this.updateVrStatus(); }, 1000);
  }

  private ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  private getUpdateStatusIcon(status: UpdateStatus) : string {
    switch (status) {
      case UpdateStatus.Green: return 'sync-green.svg';
      case UpdateStatus.Yellow: return 'sync-green.svg';
      case UpdateStatus.Red: return 'sync-green.svg';
    }
    return null;
  }

  private updateVrStatus() {
    this.vrIcon = this._localDataService.vrEnterTime() == null
                      ? "virtual-reality-off.svg"
                      : "virtual-reality-on.svg";
    // TODO(Andrei): Show h:mm left instead
    var secondsInVr = this._localDataService.secondsInVr();
    this.vrTimer = (secondsInVr == null) ? "" : secondsInVr.toFixed(0);
  }

  public onBarcode() {
    this._qrCodeScanService.scanQRCode();
  }

  public onId() {
    let accessModal = this._modalController.create(ViewQrCodePage,
      { value: `character:${this._authService.getUsername()}` });
    accessModal.present();
  }

  public onToggleVr() {
    // TODO: Send event to server
    this._localDataService.toggleVr();
    this.updateVrStatus();
  }

  public onRefresh() {
    this._dataService.trySendEvents();
  }
}
