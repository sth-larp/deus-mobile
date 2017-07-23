import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Colors } from '../config';
import { DetailsPage } from '../pages/details';
import { DetailsData, ListItemData } from '../services/viewmodel.types';
import { renderTimestamp } from '../utils/string-utils';

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html',
})
export class ListItem {
  @Input()
  public data: ListItemData;
  @Input()
  public filter: string;
  @Output()
  public deleteMe: EventEmitter<string> = new EventEmitter();

  constructor(private _modalCtrl: ModalController) { }

  public getValue(): string {
    return this.data.unixSecondsValue ? renderTimestamp(this.data.unixSecondsValue) : this.data.value;
  }

  public getValueColor(): string {
    return this.data.valueColor ? this.data.valueColor : Colors.standard;
  }

  public getProgressBarColor(): string {
    return this.data.progressBarColor ? this.data.progressBarColor : Colors.progressBarDefault;
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

  public onDelete() {
    this.deleteMe.emit(this.data.viewId);
  }
}
