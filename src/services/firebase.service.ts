declare var FCMPlugin: any;
//import { Firebase } from '@ionic-native/firebase';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LoggingService } from "./logging.service";
import { DataService } from "./data.service";
import { LoginListener } from "./login-listener";
import { AuthService } from "./auth.service";

@Injectable()
export class FirebaseService implements LoginListener {
  public token: string = null;

  constructor(//private _firebase: Firebase,
    private _logging: LoggingService,
    private _dataService: DataService,
    private _authService: AuthService) {
    _authService.addListener(this);
    this._logging.debug("FirebaseService constructor run");
  }

  public init() {
    this._logging.info('Subscribing to Firebase');
    FCMPlugin.onTokenRefresh((token) => {
        this._logging.debug(`The token is ${token}`);
        this.token = token;
    });

    FCMPlugin.subscribeToTopic('all');
    FCMPlugin.onNotification((data) => {
    if(data.wasTapped){
      //Notification was received on device tray and tapped by the user. 
      this._logging.debug( 'tapped' + JSON.stringify(data) );
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified. 
      this._logging.debug( 'not tapped' + JSON.stringify(data) );
    }
    });
  }

  public onSuccessfulLogin(username: string) {

  }

  public onLogout() {

  }
}
