import { Component, Input } from '@angular/core';
import { UpdatablePage } from "./updatable";
import { DataService } from "../services/data.service";
import { NavParams } from "ionic-angular";

class PlainTextData {
  public title: string;
  public content: string;
}

@Component({
  selector: 'page-plain-text',
  templateUrl: 'plain-text.html'
})
export class PlainTextPage extends UpdatablePage {
  @Input()
  public body: PlainTextData = {title: "", content: ""};

  constructor(dataService: DataService, navParams: NavParams) {
    super(navParams.data.id, dataService);
  }

  protected setBody(body: any) {
    this.body = body;
  }
}
