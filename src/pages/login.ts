import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from "../services/data.service";
import { MenuPage } from "./menu";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  private _loading: Loading;

  constructor(private _navCtrl: NavController,
    private _loadingCtrl: LoadingController,
    private _formBuilder: FormBuilder,
    private _dataService: DataService) {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public login() {
    this._showLoader();
    this._dataService.login(
      this.loginForm.value['username'],
      this.loginForm.value['password']).then(
      () => { this._hideLoader(); this._goToLoggedInArea() },
      err => { this._hideLoader(); console.warn(err) });
  }

  public ionViewDidLoad() {
    this._checkIfAlreadyAuthentificated();
  }

  private _checkIfAlreadyAuthentificated() {
    this._showLoader();
    this._dataService.checkAuthentication().then(() => {
      console.log("Found saved token and username, skipping authentification");
      this._hideLoader();
      this._goToLoggedInArea();
    }, (err) => {
      console.log("No token/username found, need to authentificate");
      this._hideLoader();
    });
  }

  private _goToLoggedInArea() {
    this._navCtrl.setRoot(MenuPage);
  }

  private _showLoader() {
    this._loading = this._loadingCtrl.create({
      content: 'Authenticating...'
    });
    this._loading.present();
  }

  private _hideLoader() {
    this._loading.dismiss();
    this._loading = null;
  }

}
