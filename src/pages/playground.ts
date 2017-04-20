import { Component } from '@angular/core';

import { DataService } from "../services/data.service";

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  public username: string;
  constructor(private _dataService: DataService) {
    this.username = this._dataService.getUsername();
  }
}
