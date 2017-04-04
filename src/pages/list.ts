import { Component, Input } from '@angular/core';

import { ListItemData } from '../elements/list-item';

class ListData {
  public title: string;
  public items: ListItemData[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @Input()
  public data: ListData;
}
