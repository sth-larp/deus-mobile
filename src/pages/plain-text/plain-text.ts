import { Component } from '@angular/core';

import { DataService } from '../../services/data-service';

class PlainTextData {
  title: string;
  content: string;
}

@Component({
  selector: 'page-plain-text',
  templateUrl: 'plain-text.html'
})
export class PlainTextPage {
  data: PlainTextData;

  constructor(private _dataService: DataService) {
      //console.log('PlainTextPage.constructor');
      this.data = new PlainTextData;
      _dataService.getData().subscribe(
        json => this.data = json.plain_text,
        error => console.error('PlainTextPage JSON parsing error: ' + JSON.stringify((error)))
      );
  }
}
