import * as TypeMoq from "typemoq";

class Foo {
  public bar(a: number): number { return 1; }
}

describe('TypeMoq', () => {
  it('Mocking method', () => {
    let mockFoo: TypeMoq.IMock<Foo> = TypeMoq.Mock.ofType(Foo);
    mockFoo.setup(x => x.bar(17)).returns(a => 2);
    expect(mockFoo.object.bar(17)).toEqual(2);
  });
});