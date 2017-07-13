import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { DetailsPage } from '../pages/details';
import { DetailsData, ListItemData } from '../services/viewmodel.types';

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html',
})
export class ListItem {
  @Input()
  public data: ListItemData;
  @Input()
  public filter: string;

  constructor(private _modalCtrl: ModalController) { }

  public getValueColor(): string {
    // TODO: Get color from variables.scss instead
    return this.data.valueColor ? this.data.valueColor : '#F3F5F8';
  }

  public getProgressBarColor(): string {
    // TODO: Add color to variables.scss instead
    return this.data.progressBarColor ? this.data.progressBarColor : '#6987A4';
  }

  public getProgressBarWidth(): string {
    return Math.round(this.data.percent) + '%';
  }

  public getIcon(): string {
    return 'assets/icon/' + this.data.icon + '.svg';
  }

  public openDetails(details: DetailsData) {
    const accessModal = this._modalCtrl.create(DetailsPage, { value: details });
    accessModal.present();
  }
}
