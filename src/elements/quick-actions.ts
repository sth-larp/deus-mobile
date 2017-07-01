import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, Platform } from "ionic-angular";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";

import { GlobalConfig, Colors } from "../config";
import { ViewQrCodePage } from "../pages/view-qrcode";
import { QrCodeScanService } from "../services/qrcode-scan.service";
import { DataService, UpdateStatus } from "../services/data.service";
import { LocalDataService } from "../services/local-data.service";
import { LoggingService } from "../services/logging.service";
import { AuthService } from "../services/auth.service";
import { PassportPage } from "../pages/passport";
import { LoginListener } from "../services/login-listener";

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html'
})
export class QuickActions implements LoginListener {
  public updateStatusIcon: string = null;
  public hp: number = null;
  public hpIcon: string = null;
  public hpText: string = null;
  public hpTextColor: string = null;
  public vrIcon: string = null;
  public vrTimer: string = null;
  public vrTimerColor: string = null;

  private _hpSubscription: Subscription = null;
  private _updateStatusSubscription: Subscription = null;

  constructor(private _modalController: ModalController,
    private _qrCodeScanService: QrCodeScanService,
    private _dataService: DataService,
    private _localDataService: LocalDataService,
    private _authService: AuthService,
    private _platform: Platform,
    private _actionSheetController: ActionSheetController,
    private _alertController: AlertController,
    private _logging: LoggingService) {
  }

  public ngOnInit() {
    this._authService.addListener(this);
  }

  public ngOnDestroy() {
    this._authService.removeListener(this);
  }

  public onSuccessfulLogin(username: string) {
    this._hpSubscription = this._dataService.getData().subscribe(
      json => this.updateHp(json),
      error => this._logging.error('JSON parsing error: ' + JSON.stringify(error))
    );

    this._updateStatusSubscription = this._hpSubscription = this._dataService.getUpdateStatus().subscribe(
      status => { this.updateStatusIcon = this.getUpdateStatusIcon(status); },
      error => console.error('Cannot get update status: ' + error))

    setInterval(() => { this.updateVrStatus(); }, GlobalConfig.recalculateVrTimerEveryMs);
  }

  public onLogout() {
    if (this._hpSubscription) {
      this._hpSubscription.unsubscribe();
      this._hpSubscription = null;
    }

    if (this._updateStatusSubscription) {
      this._updateStatusSubscription.unsubscribe();
      this._updateStatusSubscription = null;
    }
  }

  private getUpdateStatusIcon(status: UpdateStatus): string {
    switch (status) {
      case UpdateStatus.Green: return 'sync-green.svg';
      case UpdateStatus.Yellow: return 'sync-green.svg';
      case UpdateStatus.Red: return 'sync-green.svg';
    }
    return null;
  }

  // TODO: Add tests
  private formatInteger(value: number, padding: number): string {
    let str = value.toFixed(0);
    return (str.length >= padding) ? str : ('0000000000000000' + str).slice(-padding);
  }

  // TODO: Add tests
  // Prints "H:MM" or "M:SS" with a given separator.
  private formatTime(value: number, separator: string): string {
    value = Math.floor(value);
    let high = Math.floor(value / 60);
    let low = value % 60;
    return this.formatInteger(high, 1) + separator + this.formatInteger(low, 2);
  }

  private updateHp(modelViewJson: any) {
    this.hp = modelViewJson.toolbar.hitPoints;
    let maxHp: number = modelViewJson.toolbar.maxHitPoints;
    let hpIconIndex = Math.round(GlobalConfig.numHpQuickActionIcons * this.hp / maxHp);
    if (this.hp > 0) hpIconIndex = Math.max(hpIconIndex, 1);
    if (this.hp < maxHp) hpIconIndex = Math.min(hpIconIndex, GlobalConfig.numHpQuickActionIcons - 1);
    this.hpIcon = 'hit-points-' + this.formatInteger(hpIconIndex, 2) + '.svg';
    this.hpText = this.hp.toString();
    this.hpTextColor = (this.hp == 0) ? Colors.red : Colors.primary;
  }

  private async doSubtractHp(hpLost: number) {
    this._dataService.pushEvent('subtractHp', {hpLost: hpLost});
  }

  private async subtractHpWithConfirmation(hpLost: number) {
    let buttons = [{
      text: 'Отмена',
      role: 'cancel',
    },
    {
      text: 'Снять ' + hpLost.toString() + ' HP',
      handler: () => this.doSubtractHp(hpLost),
    }];
    let alert = this._alertController.create({
      message: "Подтвердить снятие " + hpLost.toString() + " HP?",
      buttons: buttons,
    });

    let unregisterFn = this._platform.registerBackButtonAction(() => {
      alert.dismiss();
    }, 0);
    alert.onWillDismiss(unregisterFn);
    alert.present();
  }

  // TODO: Add tests
  private getVrTimerWithColor(secondsLeft: number): string[] {
    if (secondsLeft < 0) {
      let separator = (secondsLeft % 1.0 > -0.5) ? '.' : ' ';
      return [this.formatTime(0, separator), Colors.red];
    }
    else if (secondsLeft < GlobalConfig.vrTimerYellowThresholdMs / 1000.)
      return [this.formatTime(secondsLeft, '.'), Colors.yellow];
    else
      return [this.formatTime(secondsLeft / 60, ':'), Colors.primary];
  }

  private async updateVrStatus() {
    // TODO(Andrei): Read maxSecondsInVr from ViewModel
    let maxSecondsInVr = 60 * 20 + 1;
    this.vrIcon = (await this._localDataService.inVr())
      ? 'virtual-reality-on.svg'
      : 'virtual-reality-off.svg';
    // TODO(Andrei): Change text color
    let secondsInVr = await this._localDataService.secondsInVr();
    [this.vrTimer, this.vrTimerColor] =
      (secondsInVr == null)
        ? ['', null]
        : this.getVrTimerWithColor(maxSecondsInVr - secondsInVr);
  }

  private async doToggleVr() {
    this._dataService.pushEvent(this._localDataService.inVr() ? 'exitVr' : 'enterVr', {});
    await this._localDataService.toggleVr();
    await this.updateVrStatus();
  }

  public onBarcode() {
    this._qrCodeScanService.scanQRCode();
  }

  public async onId() {
    const passportPageScreenData = (await this._dataService.getCurrentData()).passportScreen;
    let accessModal = this._modalController.create(PassportPage,
      { value: passportPageScreenData });
    accessModal.present();
  }

  public async onHp() {
    let buttons = []
    buttons.push({
      text: 'Снять все HP',
      role: 'destructive',
      handler: () => this.subtractHpWithConfirmation(this.hp),
    });
    for (let i: number = Math.min(this.hp - 1, 5); i > 0; i--) {
      buttons.push({
        text: 'Снять ' + i.toString() + ' HP',
        handler: () => this.subtractHpWithConfirmation(i),
      })
    }
    buttons.push({
      text: 'Отмена',
      role: 'cancel'
    });
    let actionSheet = this._actionSheetController.create({
      buttons: buttons
    });

    let unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present();
  }

  public async onVr() {
    const inVr: Boolean = await this._localDataService.inVr();
    let buttons = [{
      text: 'Отмена',
      role: 'cancel'
    },
    {
      text: inVr ? "Выйти из VR" : "Войти в VR",
      handler: () => this.doToggleVr(),
    }];
    let alert = this._alertController.create({
      message: inVr
        ? "Подтвердить выход из VR?"
        : "Подтвердить вход в VR?",
      buttons: buttons
    });

    let unregisterFn = this._platform.registerBackButtonAction(() => {
      alert.dismiss();
    }, 0);
    alert.onWillDismiss(unregisterFn);
    alert.present();
  }

  public onRefresh() {
    this._dataService.trySendEvents();
  }
}
