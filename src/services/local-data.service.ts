import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { MonotonicTimeService } from './monotonic-time.service';
import { InMemoryNativeStorageService, NativeStorageService } from './native-storage.service';

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

  // Helper functions
  protected makeGlobalKey(localKey: string): string {
    return this._authService.getUserId() + '/' + localKey;
  }
}

// Implements only function currently used in test
export class FakeLocalDataService extends LocalDataService {
  constructor() {
    super(null,  // MonotonicTimeService: function relying on it are not called in tests
          null,  // AuthService: all usages are overridden
          new InMemoryNativeStorageService());
  }

  protected makeGlobalKey(localKey: string): string {
    return 'testuser' + '/' + localKey;
  }
}
