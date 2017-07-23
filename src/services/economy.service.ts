import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { GlobalConfig } from '../config';
import { EnhancedAlertController } from '../elements/enhanced-controllers';
import { AuthService } from './auth.service';
import { ListItemData } from './viewmodel.types';

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService,
              private _alertCtrl: EnhancedAlertController,
              private _http: Http) { }

  public getBalance(): Promise<number> {
    return this._http.get(GlobalConfig.economyGetBalanceBaseUrl + this._authService.getUserId(),
      this._authService.getRequestOptionsWithSavedCredentials())
      .map((response) => response.json().Cash).toPromise();
  }

  public getShortTransactionHistory(): Promise<ListItemData[]> {
    return this._http.get(GlobalConfig.economyTransactionsUrl +
      '?login=' + this._authService.getUserId() + '&take=10&skip=0',
      this._authService.getRequestOptionsWithSavedCredentials())
      .map((response) => {
        const entries: any[] = response.json();
        return entries.map((entry): ListItemData => {
          return {
            text: `${entry.Sender} → ${entry.Receiver}`,
            value: `${entry.Amount} кр.`,
            details: {
              header: 'Детали операции',
              text: '<div class="pre">' + JSON.stringify(entry, null, 2) + '</div>',
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
        this._alertCtrl.show({
          title: 'Ошибка',
          message: e,
          buttons: [{text: 'Ок', handler: reject}],
        });
      };

      const notifySuccess = () => {
        this._alertCtrl.show({
          title: 'Успешно',
          message: 'Перевод выполнен!',
          buttons: [{text: 'Ок', handler: resolve}],
        });
      };

      this._alertCtrl.show({
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
    });
  }

  private _makeTransaction(receiver: string, amount: number) {
    const requestBody = JSON.stringify({
      Sender: this._authService.getUserId(),
      Receiver: receiver,
      Amount: amount,
    });

    return this._http.post(GlobalConfig.economyTransferMoneyUrl, requestBody,
      this._authService.getRequestOptionsWithSavedCredentials()).toPromise();
  }
}
