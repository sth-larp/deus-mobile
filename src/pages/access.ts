import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { DataService } from "../services/data.service";

@Component({
  selector: 'page-access',
  templateUrl: 'access.html'
})
export class AccessPage {
  public imagePath: string = 'assets/icon/wait.png';
  public area_name: string;
  constructor(navParams: NavParams,
    private _dataService: DataService) {
    this.area_name = navParams.data.area_name;
    this._dataService.checkAccessRights(this.area_name)
      .then(have_access => {
        if (have_access) 
          this.imagePath = 'assets/icon/access_granted.png';
        else
          this.imagePath = 'assets/icon/access_denied.png';
      })
      .catch(err => this.imagePath = 'assets/icon/access_denied.png');
  }
}
