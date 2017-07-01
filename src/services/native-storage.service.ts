import { Injectable } from '@angular/core';
import { NativeStorage } from 'ionic-native/dist/es5';

// Injecrable wrapper aroun NativeStorage plugin code,
// to be able to mock/fake it in tests.
@Injectable()
export class NativeStorageService {
  public setItem(reference: string, value: any): Promise<any> {
    return NativeStorage.setItem(reference, value);
  }

  public getItem(reference: string): Promise<any> {
    return NativeStorage.getItem(reference);
  }

  public remove(reference: string): Promise<any> {
    return NativeStorage.remove(reference);
  }

  public clear(): Promise<any> {
    return NativeStorage.clear();
  }
}

export class InMemoryNativeStorageService {
  private _values = new Map();

  public setItem(reference: string, value: any): Promise<any> {
    this._values.set(reference, value);
    return Promise.resolve();
  }

  public getItem(reference: string): Promise<any> {
    if (this._values.has(reference))
      return Promise.resolve(this._values.get(reference));
    else
      return Promise.reject('Not found');
  }

  public remove(reference: string): Promise<any> {
    this._values.delete(reference);
    return Promise.resolve();
  }

  public clear(): Promise<any> {
    this._values.clear();
    return Promise.resolve();
  }
}
