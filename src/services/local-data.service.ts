import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { MonotonicTimeService } from './monotonic-time.service';
import { NativeStorageService } from './native-storage.service';

// Permanent storage of per-account data
@Injectable()
export class LocalDataService {
  constructor(private _time: MonotonicTimeService,
              private _authService: AuthService,
              private _nativeStorage: NativeStorageService) {
  }

  // General API
  public setItem(key: string, value: any): Promise<any> {
    return this._nativeStorage.setItem(this.makeGlobalKey(key), value);
  }

  public getItem(key: string): Promise<any> {
    return this._nativeStorage.getItem(this.makeGlobalKey(key));
  }

  public remove(key: string): Promise<any> {
    return this._nativeStorage.remove(this.makeGlobalKey(key));
  }

  // VR API
  public async toggleVr() {
    if (await this.inVr()) {
      await this.remove('vrEnterTime');
    } else {
      await this.setItem('vrEnterTime', this._time.getUnixTimeMs());
    }
  }
  public async inVr(): Promise<boolean> {
    try {
      await this.getItem('vrEnterTime');
      return true;
    } catch (e) {
      return false;
    }
  }
  public async secondsInVr(): Promise<number> {
    try {
      const vrEnterTime = await this.getItem('vrEnterTime');
      return (this._time.getUnixTimeMs() - vrEnterTime) / 1000.;
    } catch (e) {
      return null;
    }
  }

  // Helper functions
  private makeGlobalKey(localKey: string): string {
    return this._authService.getUsername() + '/' + localKey;
  }
}
