import { Component, Input } from '@angular/core';

@Component({
  selector: 'quick-action-button',
  templateUrl: 'quick-action-button.html',
})
export class QuickActionButton {
  @Input()
  public icon: string;
  @Input()
  public text: string;
  @Input()
  public textColor: string;
  // Output: inherits "click" event from ionic button
}
