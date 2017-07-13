import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { ActionSheetController, AlertController, Config, ModalController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { Colors, GlobalConfig } from '../config';
import { PassportPage } from '../pages/passport';
import { AuthService } from '../services/auth.service';
import { DataService, UpdateStatus } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { LoggingService } from '../services/logging.service';
import { ILoginListener } from '../services/login-listener';
import { QrCodeScanService } from '../services/qrcode-scan.service';
import { formatInteger, formatTime2, formatTime3} from '../utils/string-utils';
import { fixActionSheetTransitions, fixAlertTransitions } from './deus-alert-transitions';
import { ApplicationViewModel } from "../services/viewmodel.types";

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html',
})
export class QuickActions implements ILoginListener {
  public hidden: boolean = false;
  public updateStatusIcon: string = null;
  public hp: number = null;
  public hpIcon: string = null;
  public hpText: string = null;
  public hpTextColor: string = null;
  public maxSecondsInVr: number = null;
  public vrIcon: string = null;
  public vrTimer: string = null;
  public vrTimerColor: string = null;

  private _hpSubscription: Subscription = null;
  private _updateStatusSubscription: Subscription = null;

  private _keyboardShowSubscription: Subscription = null;
  private _keyboardHideSubscription: Subscription = null;

  constructor(private _modalController: ModalController,
              private _qrCodeScanService: QrCodeScanService,
              private _dataService: DataService,
              private _localDataService: LocalDataService,
              private _authService: AuthService,
              private _platform: Platform,
              private _actionSheetController: ActionSheetController,
              private _alertController: AlertController,
              private _logging: LoggingService,
              private _keyboard: Keyboard,
              private _config: Config) {
  }

  public ngOnInit() {
    this._authService.addListener(this);
    this._keyboardShowSubscription = this._keyboard.onKeyboardShow().subscribe(() => this.hidden = true);
    this._keyboardHideSubscription = this._keyboard.onKeyboardHide().subscribe(() => this.hidden = false);
  }

  public ngOnDestroy() {
    this._authService.removeListener(this);
    this._keyboardHideSubscription.unsubscribe();
    this._keyboardShowSubscription.unsubscribe();
  }

  public onSuccessfulLogin(_username: string) {
    this._hpSubscription = this._dataService.getData().subscribe(
      (json) => {
        this.updateHp(json);
        this.updateVrStatus(json);
      },
      (error) => this._logging.error('JSON parsing error: ' + JSON.stringify(error)),
    );

    this._updateStatusSubscription = this._hpSubscription = this._dataService.getUpdateStatus().subscribe(
      (status) => { this.updateStatusIcon = this.getUpdateStatusIcon(status); },
      (error) => console.error('Cannot get update status: ' + error));

    setInterval(() => { this.updateVrStatus(null); }, GlobalConfig.recalculateVrTimerEveryMs);
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

  public onBarcode() {
    this._qrCodeScanService.scanQRCode();
  }

  public async onId() {
    const passportPageScreenData = (await this._dataService.getCurrentData()).passportScreen;
    const accessModal = this._modalController.create(PassportPage,
      { value: passportPageScreenData });
    accessModal.present();
  }

  public async onHp() {
    const buttons = [];
    buttons.push({
      text: 'Снять все HP',
      role: 'destructive',
      handler: () => this.subtractHpWithConfirmation(this.hp),
    });
    for (let i: number = Math.min(this.hp - 1, 5); i > 0; i--) {
      buttons.push({
        text: 'Снять ' + i.toString() + ' HP',
        handler: () => this.subtractHpWithConfirmation(i),
      });
    }
    buttons.push({
      text: 'Отмена',
      role: 'cancel',
    });
    const actionSheet = this._actionSheetController.create({
      buttons,
    });

    fixActionSheetTransitions(this._config);

    const unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present();
  }

  public async onVr() {
    const inVr: boolean = await this._localDataService.inVr();
    const buttons = [{
      text: 'Отмена',
      role: 'cancel',
    },
    {
      text: inVr ? 'Выйти из VR' : 'Войти в VR',
      cssClass: inVr ? null : 'destructive-button',
      handler: () => this.doToggleVr(),
    }];

    const maxTimeInVar = formatTime3(this.maxSecondsInVr, ':');
    const alert = this._alertController.create({
      title: inVr
        ? 'Выход из VR'
        : 'Вход в VR',
      message: inVr
        ? 'Вы действительно хотите покинуть VR?'
        : 'Вы действительно хотите войти в VR?<br/>' +
          `Ваше максимальное время нахождения в VR составляет <b>${maxTimeInVar}</b>.`,
      buttons,
    });

    fixAlertTransitions(this._config);

    const unregisterFn = this._platform.registerBackButtonAction(() => {
      alert.dismiss();
    }, 0);
    alert.onWillDismiss(unregisterFn);
    alert.present();
  }

  public onRefresh() {
    this._dataService.trySendEvents();
  }

  private getUpdateStatusIcon(status: UpdateStatus): string {
    switch (status) {
      case UpdateStatus.Green: return 'sync-green.svg';
      case UpdateStatus.Yellow: return 'sync-green.svg';
      case UpdateStatus.Red: return 'sync-green.svg';
    }
    return null;
  }

  private updateHp(modelViewJson: ApplicationViewModel) {
    this.hp = modelViewJson.toolbar.hitPoints;
    const maxHp: number = modelViewJson.toolbar.maxHitPoints;
    let hpIconIndex = Math.round(GlobalConfig.numHpQuickActionIcons * this.hp / maxHp);
    if (this.hp > 0) hpIconIndex = Math.max(hpIconIndex, 1);
    if (this.hp < maxHp) hpIconIndex = Math.min(hpIconIndex, GlobalConfig.numHpQuickActionIcons - 1);
    this.hpIcon = 'hit-points-' + formatInteger(hpIconIndex, 2) + '.svg';
    this.hpText = this.hp.toString();
    this.hpTextColor = (this.hp == 0) ? Colors.red : Colors.primary;
  }

  private async doSubtractHp(hpLost: number) {
    this._dataService.pushEvent('subtractHp', { hpLost });
  }

  private async subtractHpWithConfirmation(hpLost: number) {
    const buttons = [{
      text: 'Отмена',
      role: 'cancel',
    },
    {
      text: 'Снять HP',
      cssClass: 'destructive-button',
      handler: () => this.doSubtractHp(hpLost),
    }];
    const alert = this._alertController.create({
      title: 'Подтверждение урона',
      message: `Вы действительно потеряли <b>${hpLost}&nbspHP</b>?`,
      buttons,
    });

    fixAlertTransitions(this._config);

    const unregisterFn = this._platform.registerBackButtonAction(() => {
      alert.dismiss();
    }, 0);
    alert.onWillDismiss(unregisterFn);
    alert.present();
  }

  // TODO: Add tests
  private getVrTimerWithColor(secondsLeft: number): string[] {
    if (secondsLeft < 0) {
      const separator = (secondsLeft % 1.0 > -0.5) ? '.' : ' ';
      return [formatTime2(0, separator), Colors.red];
    } else if (secondsLeft < GlobalConfig.vrTimerYellowThresholdMs / 1000.)
      return [formatTime2(secondsLeft, '.'), Colors.yellow];
    else
      return [formatTime2(secondsLeft / 60, ':'), Colors.primary];
  }

  // 'json' may be null: means "no change"
  private async updateVrStatus(json: ApplicationViewModel) {
    if (json != null)
      this.maxSecondsInVr = json.general.maxSecondsInVr;

    let maxSecondsInVr = this.maxSecondsInVr;
    if (maxSecondsInVr % 60 == 0)
      maxSecondsInVr++;  // Let the user see initial time first
    this.vrIcon = (await this._localDataService.inVr())
      ? 'virtual-reality-on.svg'
      : 'virtual-reality-off.svg';
    const secondsInVr = await this._localDataService.secondsInVr();
    [this.vrTimer, this.vrTimerColor] =
      (secondsInVr == null)
        ? ['', null]
        : this.getVrTimerWithColor(maxSecondsInVr - secondsInVr);
  }

  private async doToggleVr() {
    this._dataService.pushEvent(await this._localDataService.inVr() ? 'exitVr' : 'enterVr', {});
    await this._localDataService.toggleVr();
    await this.updateVrStatus(null);
  }
}
