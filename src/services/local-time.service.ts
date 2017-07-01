import { Injectable } from '@angular/core';

@Injectable()
export class LocalTimeService {
  public getUnixTimeMs(): number {
    return new Date().valueOf();
  }
}
