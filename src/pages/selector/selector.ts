import { Component } from '@angular/core';

import { DataService } from '../../services/data-service';

class SelectorData {
  page_type: string;
  page_title: string;
  tab_label: string;
  tab_icon: string;
  body: any;
}

@Component({
  selector: 'page-selector',
  templateUrl: 'selector.html',
})
export class SelectorPage {
  data: SelectorData;

  constructor(private _dataService: DataService) {
    this.data = new SelectorData;
    _dataService.getData().subscribe(
      json => this.data = json.pages[0],
      error => console.error('SelectorPage JSON parsing error: ' + JSON.stringify((error)))
    );
  }
}
