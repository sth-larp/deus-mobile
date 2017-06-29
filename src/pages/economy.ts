import { Component } from '@angular/core';
import { ListItemData } from "../elements/list-item";
import { Http } from "@angular/http";
import { AuthService } from "../services/auth.service";
import { ModalController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

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
    private _formBuilder: FormBuilder) {

    this.sendForm = this._formBuilder.group({
      receiverId: ['', Validators.required],
      amount: ['', Validators.required]
    });

    this.receiveForm = this._formBuilder.group({
      amount: ['', Validators.required]
    });
  }

  public sendMoney() {
    console.warn("send");
  }

  public receiveMoney() {
    console.warn("receive");
  }
}

