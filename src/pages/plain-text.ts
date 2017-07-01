import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../services/data.service';
import { UpdatablePage } from './updatable';

class PlainTextData {
  public title: string;
  public content: string;
}

@Component({
  selector: 'page-plain-text',
  templateUrl: 'plain-text.html',
})
export class PlainTextPage extends UpdatablePage {
  @Input()
  public body: PlainTextData = {title: '', content: ''};

  constructor(dataService: DataService,  navCtrl: NavController, navParams: NavParams) {
    super(navParams.data.id, dataService, navCtrl);
  }

  protected setBody(body: any) {
    this.body = body;
  }
}
