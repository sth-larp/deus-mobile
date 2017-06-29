import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EconomyService {
  constructor(private _authService: AuthService) {}

  public getBalance(): Observable<number> {
    // TODO: query server
    return Observable.timer(0, 10000).map(v => 100 * v + 500);
  }
}