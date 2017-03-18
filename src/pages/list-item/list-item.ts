import { Component, Input } from '@angular/core';

export class ListItemData {
  text: string;
  subtext: string;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  data: ListItemData;
}
