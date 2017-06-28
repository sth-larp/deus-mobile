import { Component } from "@angular/core";
import { ListItemData } from "../elements/list-item";
import { NavParams } from "ionic-angular";
import { encode } from "deus-qr-lib/";
import { MonotonicTimeService } from "../services/monotonic-time.service";
import { GlobalConfig } from "../config";

@Component({
  selector: 'page-passport',
  templateUrl: 'passport.html'
})
export class PassportPage {
  public currentFilter = "";

  public id: ListItemData;
  public fullName: ListItemData;
  public email: ListItemData;
  public corporation: ListItemData;
  public insurance: ListItemData;

  public qrContent = "";

  constructor(navParams: NavParams,
    private _clock: MonotonicTimeService) {
    const passportScreenData = navParams.data.value;
    this.id = this.makeSimpleListItemData("ID", passportScreenData.id);
    this.fullName = this.makeSimpleListItemData("Имя", passportScreenData.fullName);
    this.email = this.makeSimpleListItemData("e-mail", passportScreenData.email);
    this.corporation = this.makeSimpleListItemData("Корпорация", passportScreenData.corporation);
    this.insurance = this.makeSimpleListItemData("Страховка", "None");

    this.qrContent = encode({
      type: 100, kind: 0,
      // TODO: add helper for expiring QR generation
      validUntil: (_clock.getUnixTimeMs() + GlobalConfig.passportQrLifespan) / 1000,
      payload: passportScreenData.id
    });
  }

  private makeSimpleListItemData(key: string, value: string): ListItemData {
    return {
      text: key, value: value, subtext: "", percent: 0, progressBarColor: "",
      valueColor: "", hasIcon: false, icon: "", details: null, tag: ""
    };
  }
}
