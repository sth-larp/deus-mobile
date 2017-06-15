import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login';

// Cordova has no typings available, hack to make it compile
declare var cordova: any;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  public rootPage = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      cordova.plugins.instabug.activate(
        {
          android: 'c855fb2d481e82f46320fd94b20d94c3',
          ios: '5546f72e8227ced7274417da0fdace8b'
        },
        'shake',
        {
          commentRequired: true,
          colorTheme: 'dark',
          shakingThresholdIPhone: '1.5',
          shakingThresholdIPad: '0.6',
          enableIntroDialog: false
        },
        () => {
          console.log('Instabug initialized.');
        },
        (error) => {
          console.error('Instabug could not be initialized - ' + error);
        }
      );
    });
  }
}
