import { Component, Input } from '@angular/core';
import { DetailsData, DetailsPage } from "../pages/details";
import { ModalController } from "ionic-angular";

export class ListItemData {
  public text: string;
  public subtext: string;
  public value: string;
  public percent: number;
  public progressBarColor: string;
  public valueColor: string;

  public hasIcon: boolean;
  public icon: string;

  public details: DetailsData;

  public tag: string;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  public data: ListItemData;
  constructor(private _modalCtrl: ModalController) { }

  public openDetails(details: DetailsData) {
    let accessModal = this._modalCtrl.create(DetailsPage, { value: details });
    accessModal.present();
  }
}
