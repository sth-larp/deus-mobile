import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { ModalController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { Colors, GlobalConfig } from '../config';
import { EnhancedActionSheetController, EnhancedAlertController } from '../elements/enhanced-controllers';
import { ListPage } from '../pages/list';
import { PassportPage } from '../pages/passport';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { LocalDataService } from '../services/local-data.service';
import { LoggingService } from '../services/logging.service';
import { ILoginListener } from '../services/login-listener';
import { QrCodeScanService } from '../services/qrcode-scan.service';
import { UnreadService } from '../services/unread.service';
import { ApplicationViewModel } from '../services/viewmodel.types';
import { formatInteger, formatTime2, formatTime3} from '../utils/string-utils';

@Component({
  selector: 'quick-actions',
  templateUrl: 'quick-actions.html',
})
export class QuickActions implements ILoginListener {
  public hidden: boolean = false;
  public hp: number = null;
  public hpIcon: string = null;
  public hpText: string = null;
  public hpTextColor: string = null;
  public maxSecondsInVr: number = null;
  public vrIcon: string = null;
  public vrTimer: string = null;
  public vrTimerColor: string = null;
  public notificationIcon: string = null;

  private _hpSubscription: Subscription = null;
  private _unreadSubscription: Subscription = null;

  private _keyboardShowSubscription: Subscription = null;
  private _keyboardHideSubscription: Subscription = null;

  constructor(private _modalController: ModalController,
              private _qrCodeScanService: QrCodeScanService,
              private _dataService: DataService,
              private _localDataService: LocalDataService,
              private _unreadService: UnreadService,
              private _authService: AuthService,
              private _actionSheetController: EnhancedActionSheetController,
              private _alertController: EnhancedAlertController,
              private _navController: NavController,
              private _logging: LoggingService,
              private _keyboard: Keyboard) {
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

  public onSuccessfulLogin(_id: string) {
    this._hpSubscription = this._dataService.getData().subscribe(
      (json) => {
        this.updateHp(json);
        this.updateVrStatus(json);
      },
      (error) => this._logging.error('JSON parsing error: ' + JSON.stringify(error)),
    );
    this._unreadSubscription = this._unreadService.getUnreadStats().subscribe(
      (value) => {
        this.notificationIcon = (value.changes == 0) ? 'notify-none.svg' : 'notify-changes.svg';
      },
    );
    setInterval(() => { this.updateVrStatus(null); }, GlobalConfig.recalculateVrTimerEveryMs);
  }

  public onLogout() {
    if (this._hpSubscription) {
      this._hpSubscription.unsubscribe();
      this._hpSubscription = null;
    }
    if (this._unreadSubscription) {
      this._unreadSubscription.unsubscribe();
      this._unreadSubscription = null;
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
    this._actionSheetController.show({
      buttons,
    });
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
    this._alertController.show({
      title: inVr
        ? 'Выход из VR'
        : 'Вход в VR',
      message: inVr
        ? 'Вы действительно хотите покинуть VR?'
        : 'Вы действительно хотите войти в VR?<br/>' +
          `Ваше максимальное время нахождения в VR составляет <b>${maxTimeInVar}</b>.`,
      buttons,
    });
  }

  public onNotifications() {
    this._navController.setRoot(ListPage, { id: 'page:changes' });
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
    this._alertController.show({
      title: 'Подтверждение урона',
      message: `Вы действительно потеряли <b>${hpLost}&nbspHP</b>?`,
      buttons,
    });
  }

  // TODO: Add tests
  private getVrTimerWithColor(secondsLeft: number): string[] {
    if (secondsLeft < 0) {
      return [formatTime2(secondsLeft, '.'), Colors.red];
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
