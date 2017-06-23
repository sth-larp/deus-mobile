import { Injectable } from '@angular/core'

import { MonotonicTimeService } from "./monotonic-time.service";

@Injectable()
export class LocalDataService {
  private _vrEnterTime : number = null;  // null if not in VR

  constructor(private _time: MonotonicTimeService) {
  }

  public toggleVr() {
    if (this._vrEnterTime == null) {
      console.error("### VR: in");
      this._vrEnterTime = this._time.getUnixTimeMs();
    } else {
      console.error("### VR: out");
      this._vrEnterTime = null;
    }
  }
  public vrEnterTime() : number {
    console.error("### get VR");
    return this._vrEnterTime;
  }
}
