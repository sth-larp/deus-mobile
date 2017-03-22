import { Injectable } from '@angular/core'
import { Http } from '@angular/http';

@Injectable()
export class ExampleService {
  something: string = "foo";
  constructor(public http: Http) { }

  foo() : number {return 3;}
}
