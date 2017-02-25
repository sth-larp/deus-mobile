import { Component } from '@angular/core';

import { DataService } from '../../services/data-service';

class ListData {
  title: string;
  items: string[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  data: any;

  constructor(private _dataService: DataService) {
      this.data = new ListData;
      _dataService.getData().subscribe(
        json => this.data = json.list,
        error => console.error('ListPage JSON parsing error: ' + JSON.stringify((error)))
      );
  }
}
