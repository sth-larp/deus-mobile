import { Injectable } from '@angular/core';
import {
  ActionSheetController, ActionSheetOptions, AlertController, AlertOptions,
  Config, Platform, ModalController, ModalOptions
} from 'ionic-angular';

import { fixActionSheetTransitions, fixAlertTransitions } from '../elements/deus-alert-transitions';

@Injectable()
export class EnhancedActionSheetController {
  constructor(private _actionSheetCtrl: ActionSheetController,
    private _platform: Platform,
    private _config: Config) {
  }

  public show(opts: ActionSheetOptions): void {
    const actionSheet = this._actionSheetCtrl.create(opts);
    fixActionSheetTransitions(this._config);
    const unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present();
  }
}

@Injectable()
export class EnhancedAlertController {
  constructor(private _alertController: AlertController,
    private _platform: Platform,
    private _config: Config) {
  }

  public show(opts: AlertOptions): void {
    const actionSheet = this._alertController.create(opts);
    fixAlertTransitions(this._config);
    const unregisterFn = this._platform.registerBackButtonAction(() => {
      actionSheet.dismiss();
    }, 0);
    actionSheet.onWillDismiss(unregisterFn);
    actionSheet.present();
  }
}

@Injectable()
export class EnhancedModalController {
  constructor(
    private _modalController: ModalController,
    private _platform: Platform) {}

    public show(component: any, data?: any, opts?: ModalOptions): void {
      const modalPage = this._modalController.create(component, data, opts);
      const unregisterFn = this._platform.registerBackButtonAction(() => {
        modalPage.dismiss();
      }, 0);
      modalPage.onWillDismiss(unregisterFn);
      modalPage.present();
    }
}
