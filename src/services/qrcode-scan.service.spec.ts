/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { splitQrContent } from './qrcode-scan.service'

describe('QRCodeService', () => {
  it('Splits normal string', () => {
    let split = splitQrContent("access:Hotel");
    expect(split).toEqual({ prefix: 'access', value: 'Hotel' });
  });

  it('Returns invalid if no separator', () => {
    let split = splitQrContent("bazinga");
    expect(split).toEqual({ prefix: 'invalid', value: '' });
  });
})