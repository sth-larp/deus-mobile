import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version';
import { Loading, LoadingController, NavController } from 'ionic-angular';

import { EnhancedAlertController } from '../elements/enhanced-controllers';
import { AuthService } from '../services/auth.service';
import { LoggingService } from '../services/logging.service';
import { MenuPage } from './menu';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  public version: string;
  private _loading: Loading;

  constructor(private _navCtrl: NavController,
              private _loadingCtrl: LoadingController,
              private _alertCtrl: EnhancedAlertController,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _logging: LoggingService,
              appVersion: AppVersion) {
    this.loginForm = this._formBuilder.group({
      loginOrId: ['vasya', Validators.required],
      password: ['vasya', Validators.required],
    });
    appVersion.getVersionNumber()
      .then((v) => this.version = 'v' + v)
      .catch(() => this.version = "npm start'ed, no version available");
  }

  public login() {
    this._showLoader();
    this._authService.tryLoginAndGetViewmodel(
      this.loginForm.value.loginOrId.toLowerCase(),
      this.loginForm.value.password).then(
      (viewModel) => {
        this._hideLoader();
        this._navCtrl.setRoot(MenuPage, { viewModel });
      },
      (err) => {
        this._hideLoader();
        console.warn(JSON.stringify(err));
        if (err.status == 404)
          this.showLoginFailedAlert('Персонаж с данным ID не найден');
        else if (err.status == 401)
          this.showLoginFailedAlert('Неправильный пароль');
        else
          this.showLoginFailedAlert('Ошибка подключения к серверу, повторите попытку позже');
      });
  }

  public ionViewDidLoad() {
    this._checkIfAlreadyAuthentificated();
  }

  private showLoginFailedAlert(msg: string) {
    this._alertCtrl.show({
      message: msg,
      buttons: ['Ок'],
    });
  }

  private _checkIfAlreadyAuthentificated() {
    this._showLoader();
    this._authService.checkExistingCredentials().then(() => {
      this._logging.info('Found saved id, skipping authentification');
      this._hideLoader();
      this._goToLoggedInArea();
    }, () => {
      this._logging.info('No saved id found, need to authentificate');
      this._hideLoader();
    });
  }

  private _goToLoggedInArea() {
    this._navCtrl.setRoot(MenuPage);
  }

  private _showLoader() {
    this._loading = this._loadingCtrl.create({
      content: 'Авторизация...',
    });
    this._loading.present();
  }

  private _hideLoader() {
    this._loading.dismiss();
    this._loading = null;
  }

}
