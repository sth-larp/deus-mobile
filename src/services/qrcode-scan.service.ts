import { Injectable } from "@angular/core";
import { AlertController, ModalController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoggingService } from "./logging.service";
import { GeneralQRCodePage } from "../pages/general-qrcode";
import { decode, QrData, FormatError } from "deus-qr-lib"
import { MonotonicTimeService } from "./monotonic-time.service";

class QrExpiredError extends Error {
}

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
      this.showCannotReadQrWarning();
    });
  }

  private onQRScanned(qr: string) {
    try {
      let data: QrData = decode(qr);
      this._logging.info('Decoded QR code: ' + JSON.stringify(data));
      if (data.validUntil < this._monotonicClock.getUnixTimeMs() / 1000)
        throw new QrExpiredError('QR code expired');
      let modal = this._modalController.create(GeneralQRCodePage, { value: data });
      modal.present();
    } catch (e) {
      this._logging.warning('Unsupported QR code scanned, error: ' + e);
      if (e instanceof QrExpiredError)
        this.showExperidQrWarning()
      else
        this.showInvalidQrFormatWarning();
    }
  }

  private showCannotReadQrWarning() {
    this._alertController.create({
      title: 'Не получается отсканировать QR-код',
      message: 'Приложение не может отсканировать QR-код. Пожалуйста, убедитесь, что у приложения есть ' +
               'доступ к камере, QR код хорошего качества. Используйте кнопку включения подсветки при необходимости.',
      buttons: ['Ок']
    }).present();
  }

  private showInvalidQrFormatWarning() {
    this._alertController.create({
      title: 'Некорректный формат QR-кода',
      message: 'QR-код распознан, но имеет неправильный формат. Если вы уверены, что это допустимый код ' +
               'и вам точно необходимо его использовать, сфотографируйте код и отправьте эту фотографию ' +
               'с описанием ситуации на адрес support@alice.digital.',
      buttons: ['Ок']
    }).present();
  }

  private showExperidQrWarning() {
    this._alertController.create({
      title: 'Срок действия QR-кода истек',
      message: 'QR-код распознан, но срок его действия истек. Если вы уверены, что это допустимый код ' +
               'и вам точно необходимо его использовать, сфотографируйте код и отправьте эту фотографию ' +
               'с описанием ситуации на адрес support@alice.digital.',
      buttons: ['Ок']
    }).present();
  }
}
