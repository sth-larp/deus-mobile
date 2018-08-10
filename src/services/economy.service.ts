import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { GlobalConfig } from '../config';
import { EnhancedAlertController } from '../elements/enhanced-controllers';
import { AuthService } from './auth.service';
import { ListItemData } from './viewmodel.types';

interface EconomyData {
  balance: number;
  history: ListItemData[];
}

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService,
              private _alertCtrl: EnhancedAlertController,
              private _http: Http) { }

  public getEconomyData(): Promise<EconomyData> {
    return this._http.get(GlobalConfig.economyGetDataUrl + this._authService.getUserId(),
      this._authService.getRequestOptionsWithSavedCredentials())
      .map((response) => {
        const balance = response.json().balance;
        const historyRecords: any[] = response.json().history;
        const history = historyRecords.map((entry): ListItemData => {
          if (entry.sender == this._authService.getUserId()) {
            [entry.sender, entry.receiver] = [entry.receiver, entry.sender];
            entry.amount = -entry.amount;
          }
          return {
            text: `${entry.amount} кал (счет ${entry.sender})`,
            unixSecondsValue: entry.timestamp / 1000,
            subtext: entry.description,
          };
        });
        return { balance, history };
      }).toPromise();
  }

  public makeTransaction(receiver: string, amount: number, description: string): Promise<{}> {
    // TODO: validate amount?
    if (receiver == this._authService.getUserId()) {
      return new Promise((_, reject) => {
          this._alertCtrl.show({
            title: 'Ошибка',
            message: 'Нельзя переводить деньги самому себе.',
            buttons: [{ text: 'Ок', handler: reject }],
          });
        });
    }

    return new Promise((resolve, reject) => {
      const notifyAndReject = (e: string) => {
        this._alertCtrl.show({
          title: 'Ошибка',
          message: e,
          buttons: [{ text: 'Ок', handler: reject }],
        });
      };

      const notifySuccess = () => {
        this._alertCtrl.show({
          title: 'Успешно',
          message: 'Перевод выполнен!',
          buttons: [{ text: 'Ок', handler: resolve }],
        });
      };

      let message = `Вы хотите перевести <b>${amount} кал</b> на счет <b>${receiver}</b>?`;
      if (description.length)
        message = message + ` Назначение платежа: <b>${description}</b>.`;

      this._alertCtrl.show({
        title: 'Подтверждение перевода',
        message,
        buttons: [
          {
            text: 'Отмена',
            role: 'cancel',
          },
          {
            text: 'Перевести',
            handler: async () => {
              try {
                await this._makeTransaction(receiver, amount, description);
                notifySuccess();
              } catch (e) {
                if (e && e.json && e.json() && e.json().message)
                  notifyAndReject(e.json().message);
                else
                  notifyAndReject('Неизвестная ошибка сервера');
              }
            },
          },
        ],
      });
    });
  }

  public setBonus(receiver: string, setBonus: boolean): Promise<{}> {
    return new Promise((resolve, reject) => {
      const notifyAndReject = (e: string) => {
        this._alertCtrl.show({
          title: 'Ошибка',
          message: e,
          buttons: [{ text: 'Ок', handler: reject }],
        });
      };

      const notifySuccess = () => {
        this._alertCtrl.show({
          title: 'Успешно',
          message: 'Премия установлена!',
          buttons: [{ text: 'Ок', handler: resolve }],
        });
      };

      const action = setBonus ? 'начать выплачивать' : 'прекратить выплачивать';

      const message = `Вы хотите <b>${action}</b> премию на счет <b>${receiver}</b>?`;

      this._alertCtrl.show({
        title: 'Подтверждение премии',
        message,
        buttons: [
          {
            text: 'Отмена',
            role: 'cancel',
          },
          {
            text: 'Установить',
            handler: async () => {
              try {
                await this._setBonus(receiver, setBonus);
                notifySuccess();
              } catch (e) {
                if (e && e.json && e.json() && e.json().message)
                  notifyAndReject(e.json().message);
                else
                  notifyAndReject('Неизвестная ошибка сервера');
              }
            },
          },
        ],
      });
    });
  }

  private _makeTransaction(receiver: string, amount: number, description: string) {
    const requestBody = JSON.stringify({
      sender: this._authService.getUserId(),
      receiver,
      amount,
      description,
    });

    return this._http.post(GlobalConfig.economyTransferMoneyUrl, requestBody,
      this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
  }

  private _setBonus(receiver: string, setBonus: boolean) {
    const requestBody = JSON.stringify({
      userId: receiver,
      bonusSet: setBonus,
    });

    return this._http.post(GlobalConfig.economySetBonusUrl, requestBody,
      this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
  }
}
