import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { DataService } from "../services/data.service";

@Component({
  selector: 'page-access',
  templateUrl: 'access.html'
})
export class AccessPage {
  public imagePath: string = 'assets/icon/wait.png';
  public areaName: string;
  constructor(navParams: NavParams,
    private _dataService: DataService) {
    this.areaName = navParams.data.value;
    this._dataService.checkAccessRights(this.areaName)
      .then(haveAccess => {
        if (haveAccess)
          this.imagePath = 'assets/icon/access_granted.png';
        else
          this.imagePath = 'assets/icon/access_denied.png';
      })
      .catch(err => this.imagePath = 'assets/icon/access_denied.png');
  }
}
