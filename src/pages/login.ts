import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from "../services/data.service";
import { MenuPage } from "./menu";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  constructor(private _navCtrl: NavController, private _formBuilder: FormBuilder,
    private _dataService: DataService) {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public login() {
    this._dataService.login(
      this.loginForm.value['username'],
      this.loginForm.value['password']).subscribe(
        (success: boolean) => {if (success) this._goToLoggedInArea()},
        err => console.error(err)
      );
  }

  public ionViewDidLoad() {
    this._dataService.getSid().subscribe(
      (sid: string) => this._goToLoggedInArea(),
      err => {} // It's ok, no sid stored
    );
  }

  private _goToLoggedInArea() {
    this._navCtrl.setRoot(MenuPage);
  }
}
