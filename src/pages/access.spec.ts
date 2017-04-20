import { AccessPage } from "./access";
import { DataService } from "../services/data.service";
import { TestBed, async } from "@angular/core/testing";
import * as TypeMoq from "typemoq";
import { ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { IonicModule, NavParams } from "ionic-angular";
import { Observable } from "rxjs/Rx";
import { MyApp } from "../app/app.component";
import { By } from "@angular/platform-browser";

describe('Access Page', () => {
  let fixture: ComponentFixture<AccessPage>;
  let comp: AccessPage;
  let mockDataService: TypeMoq.IMock<DataService> = TypeMoq.Mock.ofType(DataService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessPage, MyApp],
      providers: [
        { provide: DataService, useValue: mockDataService.object },
        { provide: NavParams, useValue: new NavParams({ value: "TestAreaName" }) }
      ],
      imports: [IonicModule.forRoot(MyApp)]
    }).compileComponents();
  }));

  it('Createable', () => {
    mockDataService.setup(x => x.checkAccessRights("TestAreaName")).returns(x => Promise.resolve(true));
    fixture = TestBed.createComponent(AccessPage);
    comp = fixture.componentInstance;
    expect(comp).not.toBeNull();
  });

  it('Shows area name', () => {
    mockDataService.setup(x => x.checkAccessRights("TestAreaName")).returns(x => Promise.resolve(false));
    fixture = TestBed.createComponent(AccessPage);
    comp = fixture.componentInstance;
    expect(comp.areaName).toEqual("TestAreaName");
  });

  it('Shows access granted image if there is access', fakeAsync(() => {
    mockDataService.setup(x => x.checkAccessRights("TestAreaName")).returns(x => Promise.resolve(true));
    fixture = TestBed.createComponent(AccessPage);
    tick(); // Here we force promise above to resolve, see
            // https://angular-2-training-book.rangle.io/handout/testing/components/async.html
    comp = fixture.componentInstance;
    expect(comp.imagePath).toContain("granted");
  }));

  it('Shows access denied image if there is no access', fakeAsync(() => {
    mockDataService.setup(x => x.checkAccessRights("TestAreaName")).returns(x => Promise.resolve(false));
    fixture = TestBed.createComponent(AccessPage);
    tick();
    comp = fixture.componentInstance;
    expect(comp.imagePath).toContain("denied");
  }));

  // Is this behaviour ok?
  it('Shows access denied image if there is no server connection', fakeAsync(() => {
    mockDataService.setup(x => x.checkAccessRights("TestAreaName")).returns(x => Promise.reject("Stuff is broken"));
    fixture = TestBed.createComponent(AccessPage);
    tick();
    comp = fixture.componentInstance;
    expect(comp.imagePath).toContain("denied");
  }));
});

