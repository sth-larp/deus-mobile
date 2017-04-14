import { Injectable } from "@angular/core";
import { ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccessPage } from '../pages/access'
import { LoggingService } from "./logging.service";


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
export class QrCodeScanService {
  constructor(private _barcodeScanner: BarcodeScanner,
    private _modalController: ModalController,
    private _logging: LoggingService) { }

  public showQRCode(content: string): void {
    this._barcodeScanner.encode(this._barcodeScanner.Encode.TEXT_TYPE, content);
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
      this._logging.info('Read QR code: ' + JSON.stringify(barcodeData));
      if (!barcodeData['cancelled'])
        this.onQRScanned(barcodeData['text']);
      else
        this._logging.info('QR code scanning was canncelled by user');
    }, (err) => {
      // TODO: show some error page?
      this._logging.warning('Error reading QR code: ' + err);
    });
  }

  private _prefixToPage: Map<string, any> = new Map([
    ['access', AccessPage]
  ]);

  private onQRScanned(qr: string) {
    let split: SplitQrCodeContent = splitQrContent(qr);

    if (this._prefixToPage.has(split.prefix)) {
      this._logging.info(`Scanner QR with prefix "${split.prefix}" corresponds to page, redirecting`);
      let accessModal = this._modalController.create(AccessPage, { value: split.value });
      accessModal.present();
    } else {
      // TODO: show some error page?
      this._logging.warning('Unsupported QR code scanned');
    }
  }
}
