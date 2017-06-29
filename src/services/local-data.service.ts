import { Injectable } from '@angular/core'

import { MonotonicTimeService } from "./monotonic-time.service";

// TODO: Store this data while one user stays logged in. No more, no less.
@Injectable()
export class LocalDataService {
  private _vrEnterTime : number = null;  // null if not in VR

  constructor(private _time: MonotonicTimeService) {
  }

  public toggleVr() {
    if (this._vrEnterTime == null) {
      this._vrEnterTime = this._time.getUnixTimeMs();
    } else {
      this._vrEnterTime = null;
    }
  }
  public inVr() : boolean {
    return this._vrEnterTime != null;
  }
  public vrEnterTime() : number {
    return this._vrEnterTime;
  }
  public secondsInVr() : number {
    if (this._vrEnterTime == null) {
      return null;
    } else {
      return (this._time.getUnixTimeMs() - this._vrEnterTime) / 1000.;
    }
  }
}
