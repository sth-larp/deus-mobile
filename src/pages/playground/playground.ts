import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController } from 'ionic-angular';

import { TimeService } from '../../time/time.service';

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  currentTime: string;
  constructor(public navCtrl: NavController,
              private _timeService: TimeService) {
    
    Observable.timer(0, 10000).forEach(() => this.enqueTimeUpdate());
  }

  enqueTimeUpdate() : void {
      console.log('enqueTimeUpdate');
      this._timeService.getTime().subscribe(
        json => this.currentTime = `${json.hours}:${json.minutes}:${json.seconds}`,
        error => console.error('Error: ' + error)
      );
  }

}
