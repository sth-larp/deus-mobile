import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import { AlertController } from "ionic-angular";
import { Http, Headers } from "@angular/http";
import { GlobalConfig } from "../config";

import * as BasicAuthorizationHeader from 'basic-authorization-header'

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService,
    private _alertCtrl: AlertController,
    private _http: Http) { }

  public getBalance(): Observable<number> {
    // TODO: query server
    this._http.get(GlobalConfig.economyGetBalanceBaseUrl + this._authService.getUsername(),
    {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': BasicAuthorizationHeader(this._authService.getUsername(), '123456')
      })
    })
    .subscribe(d => console.warn(d));
    return Observable.timer(0, 10000).map(v => 100 * v + 500);
  }

  public makeTransaction(receiver: string, amount: number) {
    // TODO: validate amount?
    let alert = this._alertCtrl.create({
      title: 'Подтвердите перевод',
      message: `Подтвердите перевод ${amount} на счет ${receiver}.`,
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
        },
        {
          text: 'Подтверждаю',
          handler: () => this._makeTransaction(receiver, amount)
        }
      ]
    });
    alert.present();
  }

  private _makeTransaction(receiver: string, amount: number) {
    console.warn(`Transfered ${amount} to ${receiver}.`);
  }
}