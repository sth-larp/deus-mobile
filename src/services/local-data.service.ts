import { Injectable } from '@angular/core'

import { MonotonicTimeService } from "./monotonic-time.service";
import { AuthService } from "./auth.service";
import { NativeStorageService } from "./native-storage.service";

// TODO (Andrei): Store this data while one user stays logged in. No more, no less.
@Injectable()
export class LocalDataService {
  constructor(private _time: MonotonicTimeService,
    private _authService: AuthService,
    private _nativeStorage: NativeStorageService) {
  }

  private key(): string {
    return this._authService.getUsername() + '/' + 'InVR';
  }

  public async toggleVr() {
    if (await this.inVr()) {
      await this._nativeStorage.remove(this.key());
    }
    else {
      await this._nativeStorage.setItem(this.key(), this._time.getUnixTimeMs());
    }
  }

  public async inVr(): Promise<boolean> {
    try {
      await this._nativeStorage.getItem(this.key());
      return true;
    }
    catch (e) {
      return false;
    }
  }

  public async secondsInVr(): Promise<number> {
    try {
      const vrEnterTime = await this._nativeStorage.getItem(this.key());
      return (this._time.getUnixTimeMs() - vrEnterTime) / 1000.;
    }
    catch (e) {
      return null;
    }
  }
}
