import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils } from '../../test';
import { HomePage } from './home';

let fixture: ComponentFixture<HomePage> = null;
let instance: any = null;

describe('Pages: HelloIonic', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([HomePage]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  it('initialises', () => {
    expect(fixture).not.toBeNull();
    expect(instance).not.toBeNull();
  });
 
});

