import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EnhancedAlertController } from '../elements/enhanced-controllers';
import { DataService } from '../services/data.service';
import { SublistBody } from '../services/viewmodel.types';

@Component({
  selector: 'page-sublist',
  templateUrl: 'sublist.html',
})
export class SublistPage {
  public body: SublistBody;
  private _originalBody: SublistBody;

  constructor(navParams: NavParams,
              private _navCtrl: NavController,
              private _alertController: EnhancedAlertController,
              private _dataService: DataService) {
    this._originalBody = navParams.data.value;
    this.restoreOriginalBody();
  }

    // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this.restoreOriginalBody();
  }

  public onAdd(): void {
    this._alertController.show({
      title: this.body.addAction.inputDialogTitle,
      message: this.body.addAction.inputDialogMessage,
      inputs: [
        {
          name: 'value',
          type: this.body.addAction.inputType,
        },
      ],
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
        },
        {
          text: 'Добавить',
          handler: (data) => this.addItem(data.value),
        },
      ],
    });
  }

  public onDelete(itemText: string): void {
    const index = this.body.items.findIndex((item) => item.text == itemText);
    this.body.items.splice(index, 1);
  }

  public onCancel(): void {
    this._navCtrl.pop();
  }

  public onOk(): void {
    this._dataService.pushEvent(this.body.eventType, {
      tag: this.body.eventTag,
      items: this.body.items.map((item) => (item.text)),
    });
    this._navCtrl.pop();
  }

  private addItem(itemText: string) {
    if (this.body.items.findIndex((item) => item.text == itemText) >= 0) {
      this._alertController.show({
        title: 'Ошибка добавления',
        message: 'Такое значение уже существует',
        buttons: ['Ок'],
      });
      return;
    }
    this.body.items.push({
      text: itemText,
      deletable: true,
    });
  }

  private restoreOriginalBody(): void {
    this.body = JSON.parse(JSON.stringify(this._originalBody));
  }
}
