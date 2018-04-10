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
        this.updateHp(json);
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

  public onNotifications() {
    if (this._notificationDestination)
      this._navController.setRoot(ListPage, { id: this._notificationDestination });
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
}
