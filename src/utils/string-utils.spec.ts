import { } from 'jasmine';

import { formatInteger, formatTime2, formatTime3 } from './string-utils';

describe('String utils', () => {
  it('formatInteger', () => {
    expect(formatInteger(42, 0)).toEqual('42');
    expect(formatInteger(42, 1)).toEqual('42');
    expect(formatInteger(42, 2)).toEqual('42');
    expect(formatInteger(42, 3)).toEqual('042');
    expect(formatInteger(42, 8)).toEqual('00000042');
    expect(formatInteger(0, 3)).toEqual('000');
    expect(formatInteger(-1, 0)).toEqual('−1');  // Note: Unicode minus
    expect(formatInteger(-1, 1)).toEqual('−1');  // Note: Unicode minus
    expect(formatInteger(-1, 2)).toEqual('−01');  // Note: Unicode minus
  });

  it('formatTime2', () => {
    expect(formatTime2(6, ':')).toEqual('0:06');
    expect(formatTime2(65, ':')).toEqual('1:05');
    expect(formatTime2(654, ':')).toEqual('10:54');
    expect(formatTime2(0, ':')).toEqual('0:00');
    expect(formatTime2(-1, ':')).toEqual('−0:01');  // Note: Unicode minus
    expect(formatTime2(1, '//')).toEqual('0//01');
    expect(formatTime2(1000000, ':')).toEqual('∞');
  });

  it('formatTime3', () => {
    expect(formatTime3(6, ':')).toEqual('0:00:06');
    expect(formatTime3(65, ':')).toEqual('0:01:05');
    expect(formatTime3(654, ':')).toEqual('0:10:54');
    expect(formatTime3(3609, ':')).toEqual('1:00:09');
    expect(formatTime3(36000, ':')).toEqual('10:00:00');
    expect(formatTime3(0, ':')).toEqual('0:00:00');
    expect(formatTime3(-1, ':')).toEqual('−0:00:01');  // Note: Unicode minus
    expect(formatTime3(1, '//')).toEqual('0//00//01');
    expect(formatTime3(1000000, ':')).toEqual('∞');
  });
});
