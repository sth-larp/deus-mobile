import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Refresher, ToastController, NavParams } from 'ionic-angular';
import { CustomValidators } from 'ng2-validation';

import { AuthService } from '../services/auth.service';
import { EconomyService } from '../services/economy.service';
import { ListItemData, EconomyPageViewModel } from '../services/viewmodel.types';
import { BillPage } from './bill';
import { EnhancedModalController } from '../elements/enhanced-controllers';
import { DataService } from '../services/data.service';

@Component({
  selector: 'page-economy',
  templateUrl: 'economy.html',
})
export class EconomyPage {
  public balance: number = null;

  public sendForm: FormGroup;
  public receiveForm: FormGroup;

  public setBonusForm: FormGroup;

  public isTop: boolean = false;

  public history: ListItemData[];

  public tab: string = 'main';

  constructor(private _http: Http,
              private _dataService: DataService,
              private _authService: AuthService,
              private _modalController: EnhancedModalController,
              private _toastCtrl: ToastController,
              private _formBuilder: FormBuilder,
              private _economyService: EconomyService) {
    // FIXME: Kill this hack with fire
    this._dataService.getData().subscribe({
      next: (viewmodel) =>
        this.isTop =
          (viewmodel.pages.find((page) => page.viewId == 'page:economy') as EconomyPageViewModel).isTopManager == true,
    });

    const lessThanBalanceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
      return Number(control.value) <= this.balance ? null : { lessThenBalance: false };
    };

    this.sendForm = this._formBuilder.group({
      receiverId: ['', Validators.required],
      amount: ['', Validators.compose([Validators.required, CustomValidators.digits,
      CustomValidators.gt(0), lessThanBalanceValidator])],
      description: [],
    });

    this.receiveForm = this._formBuilder.group({
      amount: ['', Validators.compose([Validators.required, CustomValidators.digits,
      CustomValidators.gt(0),
      CustomValidators.lt(1000000000000000000000000)])],
      description: ['', Validators.maxLength(40)],
    });

    this.setBonusForm = this._formBuilder.group({
      receiverId: ['', Validators.required],
      setBonus: [],
    });

    this.refreshData();
  }

  public doRefresh(refresher: Refresher) {
    // TODO: error indication?
    this.refreshData()
    .then(() => {
      refresher.complete();
      this._toastCtrl.create({
        message: 'Данные успешно обновлены',
        duration: 2000,
      }).present();
    })
    .catch((e) => {
      refresher.complete();
      this._toastCtrl.create({
        message: 'Ошибка обращения к серверу, повторите попытку позже',
        duration: 3000,
      }).present();
    });
  }

  public sendMoney() {
    const description =
      (this.sendForm.value.description != null && this.sendForm.value.description != undefined)
      ? this.sendForm.value.description : '';
    return this._economyService.makeTransaction(
      this.sendForm.value.receiverId,
      Number(this.sendForm.value.amount),
      description)
      .then(() => {
        this.refreshData();
        this.sendForm.reset();
      })
      .catch(() => {
        this.refreshData();
      });
  }

  public setBonus() {
    return this._economyService.setBonus(
      this.setBonusForm.value.receiverId,
      Boolean(this.setBonusForm.value.setBonus))
      .then(() => {
        this.refreshData();
        this.setBonusForm.reset();
      })
      .catch(() => {
        this.refreshData();
      });
  }

  public receiveMoney() {
    this._modalController.show(BillPage, {
      value: {
        amount: this.receiveForm.value.amount,
        receiverAccount: this._authService.getUserId(),
        description: this.receiveForm.value.description,
      },
    });
  }

  private async refreshData() {
    const data = await this._economyService.getEconomyData();
    this.balance = data.balance;
    this.history = data.history;
  }
}
