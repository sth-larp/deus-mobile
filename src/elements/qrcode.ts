import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ErrorCorrectLevel, QRCode } from 'qrcode-generator-ts/js';

@Component({
  selector: 'element-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrCode {
  @Input()
  public qrContent: string;

  @ViewChild('qrCanvas') private _canvasRef: ElementRef;

  public ngOnInit() {
    const qr = new QRCode();
    // Lazy man qrTypeNumber (aka version) choice:
    // Try, if failed, increase and retry.
    // TODO(aeremin) Switch to better QR generation library (one providing auto-choice of that parameter).
    for (let qrTypeNumber = 3; qrTypeNumber < 40; ++qrTypeNumber) {
      try {
        qr.setTypeNumber(qrTypeNumber);
        qr.setErrorCorrectLevel(ErrorCorrectLevel.M);
        qr.clearData();
        qr.addData(this.qrContent);
        qr.make();
        break;
      } catch (e) {
        if (e && typeof e == 'string' && e.includes('code length overflow'))
          continue;
        throw e;
      }
    }

    const ctx: CanvasRenderingContext2D =
      this._canvasRef.nativeElement.getContext('2d');

    // TODO: device-dependent size? Or how properly adjust it?
    const cellSize = 10;
    const margin = cellSize * 6;

    const size = qr.getModuleCount() * cellSize + margin * 2;
    this._canvasRef.nativeElement.width = size;
    this._canvasRef.nativeElement.height = size;

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // draw cells
    ctx.fillStyle = '#000000';
    for (let row = 0; row < qr.getModuleCount(); row += 1) {
      for (let col = 0; col < qr.getModuleCount(); col += 1) {
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
