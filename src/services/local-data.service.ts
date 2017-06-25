import { Injectable } from '@angular/core'

import { MonotonicTimeService } from "./monotonic-time.service";

@Injectable()
export class LocalDataService {
  private _vrEnterTime : number = null;  // null if not in VR

  constructor(private _time: MonotonicTimeService) {
  }

  public toggleVr() {
    if (this._vrEnterTime == null) {
      console.debug("### VR: in");
      this._vrEnterTime = this._time.getUnixTimeMs();
    } else {
      console.debug("### VR: out");
      this._vrEnterTime = null;
    }
  }
  public vrEnterTime() : number {
    console.debug("### get VR");
    return this._vrEnterTime;
  }
}
