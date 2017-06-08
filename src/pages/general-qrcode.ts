import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { DataService } from "../services/data.service";

@Component({
  selector: 'page-general-qrcode',
  templateUrl: 'general-qrcode.html'
})
export class GeneralQRCodePage {
  public id: string;
  constructor(navParams: NavParams,
    dataService: DataService) {
    this.id = navParams.data.value;
    dataService.pushEvent('usePill', { id: this.id })
  }
}
