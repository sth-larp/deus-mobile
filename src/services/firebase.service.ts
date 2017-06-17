import { Firebase } from '@ionic-native/firebase';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LoggingService } from "./logging.service";
import { DataService } from "./data.service";
import { LoginListener } from "./login-listener";
import { AuthService } from "./auth.service";

@Injectable()
export class FirebaseService implements LoginListener {
  public token: string = null;

  constructor(private _firebase: Firebase,
    private _logging: LoggingService,
    private _dataService: DataService,
    private _authService: AuthService) {
    _authService.addListener(this);
    this._logging.debug("FirebaseService constructor run");
  }

  private _subscribeToTokenChange(): Observable<string> {
    return Observable.fromPromise(this._firebase.getToken()).
      concat(this._firebase.onTokenRefresh());
  }

  public init() {
    this._logging.info('Subscribing to Firebase');
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
      notification => {
        this._logging.debug('Got notification: ' + JSON.stringify(notification));
        if (notification.refresh) this._dataService.trySendEvents();
      },
      err => this._logging.error('Error getting notification: ' + err)
    );
  }

  public onSuccessfulLogin(username: string) {

  }

  public onLogout() {

  }
}
