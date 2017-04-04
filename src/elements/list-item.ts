import { Component, Input } from '@angular/core';

export class ListItemData {
  public text: string;
  public subtext: string;
  public percent: number;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  public data: ListItemData;
}
