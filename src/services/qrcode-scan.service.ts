import { Injectable } from "@angular/core";
import { AlertController, ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AccessPage } from '../pages/access'
import { LoggingService } from "./logging.service";
import { CharacterPage } from "../pages/character";
import { GeneralQRCodePage } from "../pages/general-qrcode";


class SplitQrCodeContent {
  public codeClass: string;
  public type: string;
  public id: string;
}

export function splitQrContent(content: string): SplitQrCodeContent {
  const tokens = content.split(',');
  if (tokens.length == 3)
    return {codeClass: tokens[0], type: tokens[1], id: tokens[2] }
  else
    return { codeClass: '-1', type: '', id: '' };
}

@Injectable()
export class QrCodeScanService {
  private _prefixToPage = new  Map<string, any>();

  constructor(private _barcodeScanner: BarcodeScanner,
    private _alertController: AlertController,
    private _modalController: ModalController,
    private _logging: LoggingService) {
      // For some incredibly stupid reason it's the only way
      // to populate map in our case. Because JavaScript.
      this._prefixToPage.set('0', GeneralQRCodePage);
      this._prefixToPage.set('access', AccessPage);
      this._prefixToPage.set('character', CharacterPage);
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

  private onQRScanned(qr: string) {
    let split: SplitQrCodeContent = splitQrContent(qr);

    console.log(this._prefixToPage.keys());
    if (this._prefixToPage.has(split.codeClass)) {
      this._logging.info(`Scanner QR with class "${split.codeClass}" corresponds to page, redirecting`);
      let modal = this._modalController.create(this._prefixToPage.get(split.codeClass), { value: split.id });
      modal.present();
    } else {
      this._alertController.create({
        title: 'Неподдерживаемый QR-код',
        message: 'Приложение не может распознать QR-код. Если вы уверены, что это допустимый код ' +
        'и вам точно необходимо его использовать сфотографируйте код и отправьте эту фотографию с описанием ситуации на адрес support@alice.digital.',
        buttons: ['Окай :(']
      }).present();
      this._logging.warning('Unsupported QR code scanned');
    }
  }
}
