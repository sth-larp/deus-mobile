import { Component, Input } from '@angular/core';

export class ListItemData {
  public text: string;
  public subtext: string;
  public value: string;
  public percent: number;
  public progressBarColor: string;
  public valueColor: string;

  public hasIcon: boolean;
  public icon: string;

  public clickable: boolean;

  public tag: string;
}

@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItem {
  @Input()
  public data: ListItemData;
}
