import { Component, Input } from '@angular/core';

export class ListItemData {
  public text: string;
  public subtext: string;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  public data: ListItemData;
}
