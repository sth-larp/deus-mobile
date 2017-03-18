import { Component } from '@angular/core';

import { DataService } from '../../services/data-service';
import { ListItemData } from '../list-item/list-item';

class ListData {
  title: number;
  items: ListItemData[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  data: ListData;

  constructor(private _dataService: DataService) {
      this.data = new ListData;
      _dataService.getData().subscribe(
        json => this.data = json.list,
        error => console.error('ListPage JSON parsing error: ' + JSON.stringify((error)))
      );
  }
}
