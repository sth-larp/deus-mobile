import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from "../services/auth.service";
import { MenuPage } from "./menu";
import { LoggingService } from "../services/logging.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  private _loading: Loading;

  constructor(private _navCtrl: NavController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _logging: LoggingService) {
    this.loginForm = this._formBuilder.group({
      // TODO: remove credentials before public testing
      username: ['vasya', Validators.required],
      password: ['vasya', Validators.required],
    });
  }

  public login() {
    this._showLoader();
    this._authService.tryLoginAndGetViewmodel(
      this.loginForm.value['username'],
      this.loginForm.value['password']).then(
      viewModel => {
        this._hideLoader();
        this._navCtrl.setRoot(MenuPage, { viewModel });
      },
      err => {
        this._hideLoader();
        // TODO: show some warning/error message to user
        console.warn(JSON.stringify(err));
        if (err.status == 404)
          this.showLoginFailedAlert('Персонаж с данным ID не найден');
        else if (err.status == 401)
          this.showLoginFailedAlert('Неправильный пароль');
        else
          this.showLoginFailedAlert('Ошибка подключения к серверу, повторите попытку позже');
      });
  }

  private showLoginFailedAlert(msg: string) {
    let alert = this._alertCtrl.create({
      message: msg,
      buttons: ['Ок']
    });
    alert.present();
  }

  public ionViewDidLoad() {
    this._checkIfAlreadyAuthentificated();
  }

  private _checkIfAlreadyAuthentificated() {
    this._showLoader();
    this._authService.checkExistingCredentials().then(() => {
      this._logging.info("Found saved token and username, skipping authentification");
      this._hideLoader();
      this._goToLoggedInArea();
    }, (err) => {
      this._logging.error(JSON.stringify(err));
      this._logging.info("No token/username found, need to authentificate");
      this._hideLoader();
    });
  }

  private _goToLoggedInArea() {
    this._navCtrl.setRoot(MenuPage);
  }

  private _showLoader() {
    this._loading = this._loadingCtrl.create({
      content: 'Авторизация...'
    });
    this._loading.present();
  }

  private _hideLoader() {
    this._loading.dismiss();
    this._loading = null;
  }

}
