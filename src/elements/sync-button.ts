import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastController } from 'ionic-angular';
import { DataService, UpdateStatus, TooManyRequests } from '../services/data.service';

@Component({
  selector: 'sync-button',
  templateUrl: 'sync-button.html',
})
export class SyncButton  {
  public updateStatusIcon: string = 'sync-green.svg';

  private _updateStatusSubscription: Subscription = null;

  constructor(private _dataService: DataService,
              private _toastCtrl: ToastController) {
    this._updateStatusSubscription = this._dataService.getUpdateStatus().subscribe(
      (status) => { this.updateStatusIcon = this.getUpdateStatusIcon(status); },
      (error) => console.error('Cannot get update status: ' + error));
   }

   public ngOnDestroy() {
     this._updateStatusSubscription.unsubscribe();
   }

  public onRefresh() {
    this._dataService.trySendEvents()
    .then(() => {
      this._toastCtrl.create({
        message: 'Данные успешно обновлены',
        duration: 2000,
      }).present();
    })
    .catch((e) => {
      if (e instanceof TooManyRequests) return;
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
