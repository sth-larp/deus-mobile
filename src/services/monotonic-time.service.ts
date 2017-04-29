import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Http } from "@angular/http";
import { NativeStorage } from "ionic-native/dist/es5";
import { ServerTimeService } from "./server-time.service";
import { LocalTimeService } from "./local-time.service";
import { NativeStorageService } from "./native-storage.service";

@Injectable()
export class MonotonicTimeService {
  private _maxReturnedTime = 0;
  private _lastKnownServerToClientShift = 0;

  constructor(private _nativeStorageService: NativeStorageService,
    private _localTimeService: LocalTimeService,
    private _serverTimeService: ServerTimeService) {
    this._nativeStorageService.getItem('MonotonicTimeService/MaxReturnedTime')
      .then(t => this._maxReturnedTime = t)
      .catch(() => {});
    this._nativeStorageService.getItem('MonotonicTimeService/LastKnownServerToClientShift')
      .then(t => this._lastKnownServerToClientShift = t)
      .catch(() => {});

    _serverTimeService.getUnixTimeMs().subscribe(time => {
      this._saveLastKnownServerToClientShift(this._localTimeService.getUnixTimeMs() - time);
    });
  }

  // Returns estimated server time in msec.
  // Subsequent calls are guaranteed to return monotonically increasing values;
  public getUnixTimeMs(): number {
    const estimatedServerTime = this._localTimeService.getUnixTimeMs() - this._lastKnownServerToClientShift;
    this._maxReturnedTime = Math.max(estimatedServerTime, this._maxReturnedTime + 1);
    this._nativeStorageService.setItem('MonotonicTimeService/MaxReturnedTime', this._maxReturnedTime);
    return this._maxReturnedTime;
  }

  private _saveLastKnownServerToClientShift(shift: number) {
    this._lastKnownServerToClientShift = shift;
    this._nativeStorageService.setItem('MonotonicTimeService/LastKnownServerToClientShift', shift);
  }
}