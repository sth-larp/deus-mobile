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
  public async getItemOrNull(key: string): Promise<any> {
    try {
      return await this.getItem(key);
    } catch (e) {
      return null;
    }
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
    return (await this.secondsInVr()) != null;
  }
  public async secondsInVr(): Promise<number> {
    const vrEnterTime = await this.getItemOrNull('vrEnterTime');
    return vrEnterTime != null
      ? (this._time.getUnixTimeMs() - vrEnterTime) / 1000.
      : null;
  }

  // Helper functions
  private makeGlobalKey(localKey: string): string {
    return this._authService.getUserId() + '/' + localKey;
  }
}
