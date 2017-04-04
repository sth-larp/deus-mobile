import { Injectable } from "@angular/core";
import { ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccessPage } from '../pages/access'


class SplitQrCodeContent {
  public prefix: string;
  public value: string;
}

export function splitQrContent(content: string): SplitQrCodeContent {
  let separatorIndex: number = content.indexOf(':');
  if (separatorIndex >= 0)
    return { prefix: content.slice(0, separatorIndex), value: content.slice(separatorIndex + 1) };
  else
    return { prefix: 'invalid', value: '' };
}

@Injectable()
export class QrCodeService {
  constructor(private _barcodeScanner: BarcodeScanner,
    private _modalController: ModalController) { }

  public showQRCode(content: string): void {
    this._barcodeScanner.encode(this._barcodeScanner.Encode.TEXT_TYPE, content)
      .then(success => console.log(success))
      .then(err => console.error(err))
  }

  private _qrScanningOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: false,
    showTorchButton: true,
    torchOn: false,
    prompt: '',
    resultDisplayDuration: 0,
    formats: "QR_CODE",
    disableAnimations: true,
    disableSuccessBeep: true
  };

  public scanQRCode(): void {
    this._barcodeScanner.scan(this._qrScanningOptions).then((barcodeData) => {
      console.log('Read QR code: ', barcodeData);
      if (!barcodeData['cancelled'])
        this.onQRScanned(barcodeData['text']);
      else
        console.log('QR code scanning was canncelled by user');
    }, (err) => {
      // TODO: show some error page?
      console.error('Error reading QR code: ', err);
    });
  }

  private _prefixToPage: Map<string, any> = new Map([
    ['access', AccessPage]
  ]);

  private onQRScanned(qr: string) {
    let split: SplitQrCodeContent = splitQrContent(qr);

    if (this._prefixToPage.has(split.prefix)) {
      console.log(`Scanner QR with prefix "${split.prefix}" corresponds to page, redirecting`);
      let accessModal = this._modalController.create(AccessPage, { value: split.value });
      accessModal.present();
    } else {
      // TODO: show some error page?
      console.warn('Unsupported QR code scanned');
    }
  }
}