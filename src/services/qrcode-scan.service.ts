import { Injectable } from "@angular/core";
import { AlertController, ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoggingService } from "./logging.service";
import { CharacterPage } from "../pages/character";
import { GeneralQRCodePage } from "../pages/general-qrcode";
import { decode, QrData } from "deus-qr-lib"
import { MonotonicTimeService } from "./monotonic-time.service";

@Injectable()
export class QrCodeScanService {
  constructor(private _barcodeScanner: BarcodeScanner,
    private _alertController: AlertController,
    private _modalController: ModalController,
    private _logging: LoggingService,
    private _monotonicClock: MonotonicTimeService) {
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
      this._logging.warning('Error reading QR code: ' + err);
      this.showInvalidQrWarning()
    });
  }

  private onQRScanned(qr: string) {
    try {
      let data: QrData = decode(qr);
      this._logging.info('Decoded QR code: ' + JSON.stringify(data));
      if (data.validUntil < this._monotonicClock.getUnixTimeMs() / 1000)
        throw Error('QR code expired');
      let modal = this._modalController.create(GeneralQRCodePage, { value: data });
      modal.present();
    } catch (e) {
      this._logging.warning('Unsupported QR code scanned, error: ' + e);
      this.showInvalidQrWarning();
    }
  }

  private showInvalidQrWarning() {
    this._alertController.create({
      title: 'Неподдерживаемый QR-код',
      message: 'Приложение не может распознать QR-код. Если вы уверены, что это допустимый код ' +
      'и вам точно необходимо его использовать, сфотографируйте код и отправьте эту фотографию с описанием ситуации на адрес support@alice.digital.',
      buttons: ['Ок']
    }).present();
  }
}
