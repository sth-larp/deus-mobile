import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { Colors, GlobalConfig } from '../config';
import { EnhancedActionSheetController, EnhancedAlertController, EnhancedModalController } from '../elements/enhanced-controllers';
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
  public notificationText: string = null;

  private _hpSubscription: Subscription = null;
  private _unreadSubscription: Subscription = null;
  private _notificationDestination: string = null;

  private _keyboardShowSubscription: Subscription = null;
  private _keyboardHideSubscription: Subscription = null;

  constructor(private _modalController: EnhancedModalController,
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
        this.updateVrStatus(json);
      },
      (error) => this._logging.error('JSON parsing error: ' + JSON.stringify(error)),
    );
    this._unreadSubscription = this._unreadService.getUnreadStats().subscribe(
      (unreadStart) => {
        const currentPageData = this._navController.getActive().data;
        if (currentPageData.id) {
          if (currentPageData.id == 'page:changes')
            unreadStart.changes = 0;

          if (currentPageData.id == 'page:messages')
            unreadStart.messages = 0;
        } else {
          console.log("Not an instance");
        }
        if (unreadStart.messages > 0) {
          this.notificationIcon = 'notify-messages.svg';
          this.notificationText = unreadStart.messages.toString();
          this._notificationDestination = 'page:messages';
        } else if (unreadStart.changes > 0) {
          this.notificationIcon = 'notify-changes.svg';
          this.notificationText = unreadStart.changes.toString();
          this._notificationDestination = 'page:changes';
        } else {
          this.notificationIcon = 'notify-none.svg';
          this.notificationText = '';
          this._notificationDestination = null;
        }
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
    const accessModal = this._modalController.show(PassportPage,
      { value: passportPageScreenData });
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
    if (this._notificationDestination)
      this._navController.setRoot(ListPage, { id: this._notificationDestination });
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
      this.maxSecondsInVr = 1000;

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
