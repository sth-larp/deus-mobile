import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

declare var FCMPlugin;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.subscribeToPushNotifications();
    });
  }

  // TODO: move to separate component/service
  subscribeToPushNotifications() : void {
      FCMPlugin.getToken(
          function (token) {
              console.log(token);
          },
          function (err) {
              console.error('error retrieving token: ' + err);
          }
      );

      FCMPlugin.onNotification(
          (data) => {
              var dataString : string = JSON.stringify(data);
              console.log(dataString);
              alert(dataString);
              // TODO: data.wasTapped is true if application was (re)-opened due to notification tap.
          },
          (msg) => {
              console.log('onNotification callback successfully registered: ' + msg);
          },
          (err) => {
              console.error('Error registering onNotification callback: ' + err);
          }
      );
  }
}
