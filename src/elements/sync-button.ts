import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastController } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { DataService, UpdateStatus } from '../services/data.service';
import { ILoginListener } from '../services/login-listener';

@Component({
  selector: 'sync-button',
  templateUrl: 'sync-button.html',
})
export class SyncButton implements ILoginListener {
  public updateStatusIcon: string = null;

  private _updateStatusSubscription: Subscription = null;

  constructor(private _dataService: DataService,
              private _authService: AuthService,
              private _toastCtrl: ToastController) {
  }

  public ngOnInit() {
    this._authService.addListener(this);
  }

  public ngOnDestroy() {
    this._authService.removeListener(this);
  }

  public onSuccessfulLogin(_id: string) {
    this._updateStatusSubscription = this._dataService.getUpdateStatus().subscribe(
      (status) => { this.updateStatusIcon = this.getUpdateStatusIcon(status); },
      (error) => console.error('Cannot get update status: ' + error));
  }
  public onLogout() {
    if (this._updateStatusSubscription) {
      this._updateStatusSubscription.unsubscribe();
      this._updateStatusSubscription = null;
    }
  }

  public onRefresh() {
    this._dataService.trySendEvents()
    .then(() => {
      this._toastCtrl.create({
        message: 'Данные успешно обновлены',
        duration: 2000,
      }).present();
    })
    .catch(() => {
      this._toastCtrl.create({
        message: 'Ошибка обращения к серверу, повторите попытку позже',
        duration: 3000,
      }).present();
    });
  }

  private getUpdateStatusIcon(status: UpdateStatus): string {
    switch (status) {
      case UpdateStatus.Green: return 'sync-green.svg';
      case UpdateStatus.Yellow: return 'sync-yellow.svg';
      case UpdateStatus.Red: return 'sync-red.svg';
    }
    return null;
  }
}
