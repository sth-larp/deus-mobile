import { Component } from '@angular/core';
import { ListItemData } from "../elements/list-item";

@Component({
  selector: 'page-economy',
  templateUrl: 'economy.html'
})
export class EconomyPage {
  public balance: ListItemData = {text: 'Баланс', value: "100500" };

  constructor() {
  }
}
