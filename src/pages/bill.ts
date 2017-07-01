import { Component } from '@angular/core';
import { encode } from 'deus-qr-lib/lib/qr';
import { QrType } from 'deus-qr-lib/lib/qr.type';
import { NavParams } from 'ionic-angular';
import { GlobalConfig } from '../config';
import { MonotonicTimeService } from '../services/monotonic-time.service';

export class BillPageData {
  public amount: number;
  public receiverAccount: string;
}

@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html',
})
export class BillPage {
  public qrContent = '';
  public billPageData: BillPageData;
  constructor(navParams: NavParams,
              private _clock: MonotonicTimeService) {
    this.billPageData = navParams.data.value;
    console.warn(this.billPageData);
    this.qrContent = encode({
      type: QrType.Bill, kind: 0,
      // TODO: add helper for expiring QR generation
      validUntil: (_clock.getUnixTimeMs() + GlobalConfig.transactionQrLifespan) / 1000,
      payload: `${this.billPageData.receiverAccount},${this.billPageData.amount}`,
    });
  }
}
