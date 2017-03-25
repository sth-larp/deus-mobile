import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from "../services/data.service";
import { TabsPage } from "./tabs";

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

  login() {
    this._dataService.login(
      this.loginForm.value['username'],
      this.loginForm.value['password']).subscribe(
        (success: boolean) => {if (success) this.goToLoggedInArea()},
        err => console.error(err)
      );
  }

  ionViewDidLoad() {
    this._dataService.getSid().subscribe(
      (sid: string) => this.goToLoggedInArea(),
      err => {} // It's ok, no sid stored
    );
  }

  goToLoggedInArea() {
    this._navCtrl.setRoot(TabsPage);
  }
}
