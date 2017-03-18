import { Component, Input } from '@angular/core';

class PlainTextData {
  title: string;
  content: string;
}

@Component({
  selector: 'page-plain-text',
  templateUrl: 'plain-text.html'
})
export class PlainTextPage {
  @Input()
  data: PlainTextData;
}
