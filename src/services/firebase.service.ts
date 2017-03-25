import { Firebase } from '@ionic-native/firebase';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class FirebaseService {
  public token: string = null;

  constructor(private _firebase: Firebase) {
    console.log("FirebaseService constructor run");
    
    this.subscribeToTokenChange().subscribe(
      token => {
        console.log(`The token is ${token}`);
        this.token = token;
      },
      error => console.error('Error getting token', error)
    );

    this._firebase.hasPermission().then()
      .then(() => console.log('Have push permission!'))
      .catch(() => this._firebase.grantPermission()
        .then(() => console.log('Got push permission!'))
        .catch(() => console.warn('Did NOT get push permission!'))
      );

    this._firebase.subscribe("all")
      .then(() => console.log('Subscribed to "all" topic'))
      .catch(err => console.error('Error subscribing to "all" topic: ', err));

    this._firebase.onNotificationOpen().subscribe(
      notification => console.log('Got notification: ', JSON.stringify(notification)),
      err => console.error('Error getting notification: ', err)
    );
  }

  subscribeToTokenChange(): Observable<string> {
    return Observable.fromPromise(this._firebase.getToken()).
      concat(this._firebase.onTokenRefresh());
  }
}
