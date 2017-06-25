import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'quick-action-button',
  templateUrl: 'quick-action-button.html'
})
export class QuickActionButton {
  @Input()
  public icon: string;
  // Output: inherits "click" event from ionic button

  constructor() {
  }
}
