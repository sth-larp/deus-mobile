import { Component, Input } from '@angular/core';
import { UpdatablePage } from "./updatable";
import { DataService } from "../services/data.service";
import { NavParams, NavController } from "ionic-angular";

class EconomyData {
  public balance: number;
}

@Component({
  selector: 'page-economy',
  templateUrl: 'economy.html'
})
export class EconomyPage extends UpdatablePage {
  @Input()
  public body: EconomyData = new EconomyData;

  constructor(dataService: DataService,  navCtrl: NavController, navParams: NavParams) {
    super(navParams.data.id, dataService, navCtrl);
  }

  protected setBody(body: any) {
    this.body = body;
  }
}
