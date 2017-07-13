import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, Config } from 'ionic-angular';

import { GlobalConfig } from '../config';
import { fixAlertTransitions } from '../elements/deus-alert-transitions';
import { AuthService } from './auth.service';
import { ListItemData } from './viewmodel.types';

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService,
              private _alertCtrl: AlertController,
              private _http: Http,
              private _config: Config) { }

  public getBalance(): Promise<number> {
    return this._http.get(GlobalConfig.economyGetBalanceBaseUrl + this._authService.getUsername(),
      this._authService.getRequestOptionsWithSavedCredentials())
      .map((response) => response.json().Cash).toPromise();
  }

  public getShortTransactionHistory(): Promise<ListItemData[]> {
    return this._http.get(GlobalConfig.economyTransactionsUrl +
      '?login=' + this._authService.getUsername() + '&take=10&skip=0',
      this._authService.getRequestOptionsWithSavedCredentials())
      .map((response) => {
        const entries: any[] = response.json();
        return entries.map((entry): ListItemData => {
          return {
            text: `${entry.Sender} → ${entry.Receiver}`,
            value: `${entry.Amount} кр.`,
            details: {
              header: 'Детали операции',
              text: JSON.stringify(entry, null, 2),
              actions: null,
            },
          };
        });
      }).toPromise();
  }

  public makeTransaction(receiver: string, amount: number): Promise<{}> {
    // TODO: validate amount?
    return new Promise((resolve, reject) => {
      const notifyAndReject = (e: string) => {
        const alert = this._alertCtrl.create({
          title: 'Ошибка',
          message: e,
          buttons: [{text: 'Ок', handler: reject}],
        });

        fixAlertTransitions(this._config);
        alert.present();
      };

      const notifySuccess = () => {
        const alert = this._alertCtrl.create({
          title: 'Успешно',
          message: 'Перевод выполнен!',
          buttons: [{text: 'Ок', handler: resolve}],
        });

        fixAlertTransitions(this._config);
        alert.present();
      };

      const alert = this._alertCtrl.create({
        title: 'Подтверждение перевода',
        message: `Вы хотите перевести <b>${amount} кр.</b> на счет <b>${receiver}</b>?`,
        buttons: [
          {
            text: 'Отмена',
            role: 'cancel',
          },
          {
            text: 'Перевести',
            handler: async () => {
              try {
                await this._makeTransaction(receiver, amount);
                notifySuccess();
              } catch (e) {
                if (e && e.json && e.json() && e.json().Message)
                  notifyAndReject(e.json().Message);
                else
                  notifyAndReject('Сервер недоступен');
              }
            },
          },
        ],
      });

      fixAlertTransitions(this._config);

      alert.present();
    });
  }

  private _makeTransaction(receiver: string, amount: number) {
    const requestBody = JSON.stringify({
      Sender: this._authService.getUsername(),
      Receiver: receiver,
      Amount: amount,
    });

    return this._http.post(GlobalConfig.economyTransferMoneyUrl, requestBody,
      this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
  }
}
