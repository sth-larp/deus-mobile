import { Component, Input } from '@angular/core';

class PlainTextData {
  public title: string;
  public content: string;
}

@Component({
  selector: 'page-plain-text',
  templateUrl: 'plain-text.html'
})
export class PlainTextPage {
  @Input()
  public data: PlainTextData;
}
