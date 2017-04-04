import { Component } from '@angular/core';
import { App } from "ionic-angular";
import { DataService } from "../services/data.service";
import { LoginPage } from "../pages/login";

@Component({
  selector: 'logout-button',
  templateUrl: 'logout-button.html'
})
export class LogoutButton {
  constructor(private _app: App, private _dataService: DataService) { }

  public logout() {
    this._dataService.logout();
    this._app.getRootNav().setRoot(LoginPage);
  }
}


