import { Component, Input } from '@angular/core';

import { ListItemData } from '../list-item/list-item';

class ListData {
  title: string;
  items: ListItemData[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @Input()
  data: ListData;
}
