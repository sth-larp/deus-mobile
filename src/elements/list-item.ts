import { Component, Input } from '@angular/core';
import { Colors } from '../config';
import { DetailsPage } from '../pages/details';
import { SublistPage } from '../pages/sublist';
import { ListItemData } from '../services/viewmodel.types';
import { renderTimestamp } from '../utils/string-utils';
import { EnhancedModalController } from './enhanced-controllers';

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html',
})
export class ListItem {
  @Input()
  public data: ListItemData;
  @Input()
  public filter: string;

  constructor(private _modalCtrl: EnhancedModalController) { }

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

  public hasSubpage(): boolean {
    return !!this.data.details || !!this.data.sublist;
  }

  public openSubpage(): void {
    const accessModal = this.data.details
      ? this._modalCtrl.show(DetailsPage, { value: this.data.details })
      : this._modalCtrl.show(SublistPage, { value: this.data.sublist });
  }
}
