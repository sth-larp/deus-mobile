import { Firebase } from '@ionic-native/firebase';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LoggingService } from "./logging.service";

@Injectable()
export class FirebaseService {
  public token: string = null;

  constructor(private _firebase: Firebase,
              private _logging: LoggingService) {
    this._logging.debug("FirebaseService constructor run");

    this._subscribeToTokenChange().subscribe(
      token => {
        this._logging.debug(`The token is ${token}`);
        this.token = token;
      },
      error => console.error('Error getting token', error)
    );

    this._firebase.hasPermission().then()
      .then(() => this._logging.debug('Have push permission!'))
      .catch(() => this._firebase.grantPermission()
        .then(() => this._logging.debug('Got push permission!'))
        .catch(() => this._logging.warning('Did NOT get push permission!'))
      );

    this._firebase.subscribe("all")
      .then(() => this._logging.debug('Subscribed to "all" topic'))
      .catch(err => console.error('Error subscribing to "all" topic: ', err));

    this._firebase.onNotificationOpen().subscribe(
      notification => this._logging.debug('Got notification: ' + JSON.stringify(notification)),
      err => this._logging.error('Error getting notification: ' + err)
    );
  }

  private _subscribeToTokenChange(): Observable<string> {
    return Observable.fromPromise(this._firebase.getToken()).
      concat(this._firebase.onTokenRefresh());
  }
}
