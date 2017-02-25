import { Component, Input } from '@angular/core';

class ListItemData {
  text: string;
  subtext: string;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  data: any;
}
