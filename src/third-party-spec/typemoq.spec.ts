import {describe, expect, it} from 'angular2/testing';
import * as TypeMoq from 'typemoq';

class Foo {
  public bar(_a: number): number { return 1; }
}

describe('TypeMoq', () => {
  it('Mocking method', () => {
    const mockFoo: TypeMoq.IMock<Foo> = TypeMoq.Mock.ofType(Foo);
    mockFoo.setup((x) => x.bar(17)).returns((_a) => 2);
    expect(mockFoo.object.bar(17)).toEqual(2);
  });
});
