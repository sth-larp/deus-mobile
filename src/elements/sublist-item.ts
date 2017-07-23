import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SublistItemData } from '../services/viewmodel.types';

@Component({
  selector: 'sublist-item',
  templateUrl: 'sublist-item.html',
})
export class SublistItem {
  @Input()
  public data: SublistItemData;
  @Output()
  public deleteMe: EventEmitter<string> = new EventEmitter();

  constructor() {}

  public onDelete() {
    this.deleteMe.emit(this.data.text);
  }
}
