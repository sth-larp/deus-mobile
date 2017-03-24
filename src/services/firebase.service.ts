import { Firebase } from '@ionic-native/firebase';
import { Injectable } from "@angular/core";

@Injectable()
export class FirebaseService {
  constructor(private _firebase: Firebase) {
    console.log("FirebaseService constructor run");
    this._firebase.getToken()
      .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));

    this._firebase.onTokenRefresh()
      .subscribe((token: string) => console.log(`Got a new token ${token}`));

    this._firebase.hasPermission().then()
      .then(() => console.log('Have push permission!'))
      .catch(() => this._firebase.grantPermission()
        .then(() => console.log('Got push permission!'))
        .catch(() => console.warn('Did NOT get push permission!'))
      );
  }
}
