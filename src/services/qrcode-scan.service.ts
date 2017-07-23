import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, ModalController } from 'ionic-angular';
import { TSMap } from 'typescript-map';

import { decode, QrData } from 'deus-qr-lib/lib/qr';
import { QrType } from 'deus-qr-lib/lib/qr.type';
import { EventEmitter } from 'events';
import { GeneralQRCodePage } from '../pages/general-qrcode';
import { EconomyService } from './economy.service';
import { LoggingService } from './logging.service';
import { MonotonicTimeService } from './monotonic-time.service';

class QrExpiredError extends Error {
}

type QrCallback = ((data: QrData) => void);

export abstract class QrCodeScanServiceBase {
  private _qrScanningOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: false,
    showTorchButton: true,
    torchOn: false,
    prompt: '',
    resultDisplayDuration: 0,
    formats: 'QR_CODE',
    disableAnimations: true,
    disableSuccessBeep: true,
  };

  constructor(private _barcodeScanner: BarcodeScanner,
              private _alertController: AlertController,
              private _logging: LoggingService,
              private _monotonicClock: MonotonicTimeService) {
  }

  public scanQRCode(): void {
    this._barcodeScanner.scan(this._qrScanningOptions).then((barcodeData) => {
      this._logging.info('Read QR code: ' + JSON.stringify(barcodeData));
      if (!barcodeData.cancelled)
        this.onQRScanned(barcodeData.text);
      else
        this._logging.info('QR code scanning was canncelled by user');
    }, (err) => {
      this._logging.warning('Error reading QR code: ' + err);
      this.onQrScanFailed();
      this.showCannotReadQrWarning();
    });
  }

  protected abstract onQrParsed(data: QrData);
  protected abstract onQrScanFailed();

  private onQRScanned(qr: string) {
    try {
      const data: QrData = decode(qr);
      this._logging.info('Decoded QR code: ' + JSON.stringify(data));
      if (data.validUntil < this._monotonicClock.getUnixTimeMs() / 1000)
        throw new QrExpiredError('QR code expired');
      this.onQrParsed(data);
    } catch (e) {
      this._logging.warning('Unsupported QR code scanned, error: ' + e);
      this.onQrScanFailed();
      if (e instanceof QrExpiredError)
        this.showExperidQrWarning();
      else
        this.showInvalidQrFormatWarning();
    }
  }

  private showCannotReadQrWarning() {
    this._alertController.create({
      title: 'Не получается отсканировать QR-код',
      message: 'Приложение не может отсканировать QR-код. Пожалуйста, убедитесь, что у приложения есть ' +
      'доступ к камере, QR код хорошего качества. Используйте кнопку включения подсветки при необходимости.',
      buttons: ['Ок'],
    }).present();
  }

  private showInvalidQrFormatWarning() {
    this._alertController.create({
      title: 'Некорректный формат QR-кода',
      message: 'QR-код распознан, но имеет неправильный формат. Если вы уверены, что это допустимый код ' +
      'и вам точно необходимо его использовать, сфотографируйте код и отправьте эту фотографию ' +
      'с описанием ситуации на адрес support@alice.digital.',
      buttons: ['Ок'],
    }).present();
  }

  private showExperidQrWarning() {
    this._alertController.create({
      title: 'Срок действия QR-кода истек',
      message: 'QR-код распознан, но срок его действия истек. Если вы уверены, что это допустимый код ' +
      'и вам точно необходимо его использовать, сфотографируйте код и отправьте эту фотографию ' +
      'с описанием ситуации на адрес support@alice.digital.',
      buttons: ['Ок'],
    }).present();
  }
}

@Injectable()
export class QrCodeScanService extends QrCodeScanServiceBase {
  private _qrTypeToCallback = new TSMap<QrType, QrCallback>();
  private _defaultCallback: QrCallback;

  constructor(barcodeScanner: BarcodeScanner,
              alertController: AlertController,
              logging: LoggingService,
              monotonicClock: MonotonicTimeService,
              private _modalController: ModalController,
              private _economyService: EconomyService) {
    super(barcodeScanner, alertController, logging, monotonicClock);
    this._defaultCallback = (data: QrData) => {
      const modal = this._modalController.create(GeneralQRCodePage, { value: data });
      modal.present();
    };

    this.registerCallback(QrType.Bill, (data) => {
      const splitPayload = data.payload.split(',');
      this._economyService.makeTransaction(splitPayload[0], Number(splitPayload[1]));
    });
  }

  protected onQrParsed(data: QrData) {
    if (this._qrTypeToCallback.has(data.type))
      this._qrTypeToCallback.get(data.type)(data);
    else
      this._defaultCallback(data);
  }

  protected onQrScanFailed() {
  }

  private registerCallback(type: QrType, callback: QrCallback) {
    this._qrTypeToCallback.set(type, callback);
  }

}

@Injectable()
export class QrCodeScanServiceCustom extends QrCodeScanServiceBase {
  private _eventEmitter = new EventEmitter();

  constructor(barcodeScanner: BarcodeScanner,
              alertController: AlertController,
              logging: LoggingService,
              monotonicClock: MonotonicTimeService) {
    super(barcodeScanner, alertController, logging, monotonicClock);
  }

  public observeQrsParsed(): Promise<QrData> {
    return new Promise((resolve, reject) => {
      this._eventEmitter.on('qrParsed', (data) => resolve(data));
      this._eventEmitter.on('qrScanFailed', () => reject());
    });
  }

  protected onQrParsed(data: QrData) {
    this._eventEmitter.emit('qrParsed', data);
  }

  protected onQrScanFailed() {
    this._eventEmitter.emit('qrScanFailed', {});
  }
}
