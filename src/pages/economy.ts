import { Component } from '@angular/core';
import { ListItemData } from "../elements/list-item";
import { Http } from "@angular/http";
import { AuthService } from "../services/auth.service";
import { ModalController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EconomyService } from "../services/economy.service";
import { BillPage } from "./bill";

@Component({
  selector: 'page-economy',
  templateUrl: 'economy.html'
})
export class EconomyPage {
  public balance: ListItemData = { text: 'Баланс', value: "100500" };

  public sendForm: FormGroup;
  public receiveForm: FormGroup;

  constructor(private _http: Http,
    private _authService: AuthService,
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
    private _economyService: EconomyService) {

    this.sendForm = this._formBuilder.group({
      receiverId: ['', Validators.required],
      amount: ['', Validators.required]
    });

    this.receiveForm = this._formBuilder.group({
      amount: ['', Validators.required]
    });

    this._economyService.getBalance().subscribe(v => this.balance.value = v.toString());
  }

  public sendMoney() {
    this._economyService.makeTransaction(
      this.sendForm.value['receiverId'],
      this.sendForm.value['amount']);
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

