import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { LoggingService } from "../services/logging.service";
import { QRCode, ErrorCorrectLevel } from 'qrcode-generator-ts/js';

@Component({
  selector: 'page-qrcode',
  templateUrl: 'view-qrcode.html'
})
export class ViewQrCodePage {
  public qrContent: string;
  public imagePath: string;

  @ViewChild('qrCanvas') private _canvasRef: ElementRef;

  constructor(navParams: NavParams,
              private _logging: LoggingService) {
    this.qrContent = navParams.data.value;
    _logging.info(`Demonstrating QR: ${JSON.stringify(this.qrContent)}`);
  }

  // tslint:disable-next-line:no-unused-variable
  private ionViewDidEnter() {
    let qr = new QRCode();
    qr.setTypeNumber(3);
    qr.setErrorCorrectLevel(ErrorCorrectLevel.M);
    qr.addData(this.qrContent);
    qr.make();

    let ctx: CanvasRenderingContext2D =
      this._canvasRef.nativeElement.getContext('2d');

    // TODO: device-dependent size? Or how properly adjust it?
    let cellSize = 10;
    let margin = cellSize * 4

    var size = qr.getModuleCount() * cellSize + margin * 2;
    this._canvasRef.nativeElement.width = size;
    this._canvasRef.nativeElement.height = size;

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // draw cells
    ctx.fillStyle = '#000000';
    for (var row = 0; row < qr.getModuleCount(); row += 1) {
      for (var col = 0; col < qr.getModuleCount(); col += 1) {
        if (qr.isDark(row, col) ) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize, cellSize);
        }
      }
    }
  }
}

