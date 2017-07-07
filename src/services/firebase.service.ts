import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { LoggingService } from './logging.service';
import { ILoginListener } from './login-listener';

@Injectable()
export class FirebaseService implements ILoginListener {
  public onSuccessfulLogin(_username: string) {}
  public onLogout() {}
}
