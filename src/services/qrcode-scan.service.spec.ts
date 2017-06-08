/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
import { splitQrContent } from './qrcode-scan.service'

describe('QRCodeService', () => {
  it('Splits normal string', () => {
    let split = splitQrContent("0,1,dad38bc7-a67c-4d78-895d-975d128b9be8");
    expect(split).toEqual({ codeClass: "0", type: "1", id: "dad38bc7-a67c-4d78-895d-975d128b9be8" });
  });

  it('Returns invalid if no separator', () => {
    let split = splitQrContent("bazinga");
    expect(split).toEqual({ codeClass: "-1", type: "", id: "" });

    split = splitQrContent("bazinga,thing");
    expect(split).toEqual({ codeClass: "-1", type: "", id: "" });

    split = splitQrContent("bazinga,thing,stuff,magic");
    expect(split).toEqual({ codeClass: "-1", type: "", id: "" });
  });
})