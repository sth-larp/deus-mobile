import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-playground',
  templateUrl: 'playground.html'
})
export class PlaygroundPage {
  currentTime: string;
  constructor(public navCtrl: NavController,
              private http: Http) {
    
    Observable.interval(10000).forEach((iter: number) => {
      http.get('https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec').subscribe(
        response => this.currentTime = response.json().hours + ':' + response.json().minutes + ':' + response.json().seconds,
        error => console.error('Error: ' + error),
        () => console.log('Completed!'));
    });
  }

}
