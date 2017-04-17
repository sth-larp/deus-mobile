import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { ListItemData } from '../elements/list-item';
import { UpdatablePage } from "./updatable";
import { LoggingService } from "../services/logging.service";
import { DataService } from "../services/data.service";

class ListBody {
  public title: string;
  public items: ListItemData[];
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage extends UpdatablePage {
  public body: ListBody = { title: "", items: [] };

  constructor(dataService: DataService,
    logging: LoggingService,
    navParams: NavParams) {
    super(navParams.data.id, dataService, logging);
  }

  protected setBody(body: any) {
    this.body = body;
  }
}
