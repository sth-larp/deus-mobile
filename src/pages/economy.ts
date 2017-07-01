import { Component } from '@angular/core';
import { ListItemData } from "../elements/list-item";
import { Http } from "@angular/http";
import { AuthService } from "../services/auth.service";
import { ModalController, Refresher, AlertController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { EconomyService } from "../services/economy.service";
import { BillPage } from "./bill";
import { CustomValidators } from 'ng2-validation';


@Component({
  selector: 'page-economy',
  templateUrl: 'economy.html'
})
export class EconomyPage {
  public balance: ListItemData = { text: 'Баланс', value: "" };

  public sendForm: FormGroup;
  public receiveForm: FormGroup;

  public history: ListItemData[];

  constructor(private _http: Http,
    private _authService: AuthService,
    private _modalController: ModalController,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _economyService: EconomyService) {

    const lessThanBalanceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
      return Number(control.value) <= Number(this.balance.value) ? null : { lessThenBalance: false };
    };

    this.sendForm = this._formBuilder.group({
      receiverId: ['', Validators.required],
      amount: ['', Validators.compose([Validators.required, CustomValidators.digits, lessThanBalanceValidator])]
    });

    this.receiveForm = this._formBuilder.group({
      amount: ['', Validators.compose([Validators.required, CustomValidators.digits])]
    });

    this.refreshData();
  }

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this.refreshData()
      .then(() => refresher.complete())
      .catch(() => refresher.complete());
  }

  private async refreshData() {
    let balanceNum = 0;
    [balanceNum, this.history] = await Promise.all([this._economyService.getBalance(), this._economyService.getShortTransactionHistory()])
    this.balance.value = balanceNum.toString();
  }

  public sendMoney() {
    return this._economyService.makeTransaction(
      this.sendForm.value['receiverId'],
      this.sendForm.value['amount'])
      .then(() => {
        this.refreshData()
        this.sendForm.reset();
      })
      .catch((reason: string) => {
        let alert = this._alertCtrl.create({
          title: 'Ошибка',
          message: reason,
          buttons: ['Ок']
        });
        alert.present();
        this.refreshData();
      });
  }

  public receiveMoney() {
    this._modalController.create(BillPage, {
      value: {
        amount: this.receiveForm.value['amount'],
        receiverAccount: this._authService.getUsername()
      }
    }).present();
  }
}

