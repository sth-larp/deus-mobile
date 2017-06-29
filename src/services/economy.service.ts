import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";
import { AlertController } from "ionic-angular";

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService,
    private _alertCtrl: AlertController) { }

  public getBalance(): Observable<number> {
    // TODO: query server
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