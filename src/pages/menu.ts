 import { Component, ViewChild } from '@angular/core';
 import { Nav, NavController, NavParams } from 'ionic-angular';
 import { Subscription } from 'rxjs/Subscription';

 import { AuthService } from '../services/auth.service';
 import { DataService } from '../services/data.service';
 import { FirebaseService } from '../services/firebase.service';
 import { LoggingService } from '../services/logging.service';
 import { ILoginListener } from '../services/login-listener';
 import { EconomyPage } from './economy';
 import { ListPage } from './list';
 import { LoginPage } from './login';
 import { PlainTextPage } from './plain-text';
 import { TechnicalInfoPage } from './technical-info';

 class PageData {
  public root: any;
  public menuTitle: string;
}

 @Component({
  templateUrl: 'menu.html',
})
export class MenuPage implements ILoginListener {
  public pages: PageData[] = [{root: ListPage, menuTitle: ''}];
  public characterName: string = null;

  @ViewChild(Nav) private _nav: Nav;
  private _pageTypeToPage = new Map<string, any>();
  private _subscription: Subscription = null;

  constructor(private _dataService: DataService,
              private _authService: AuthService,
              private _navCtrl: NavController,
              private _logging: LoggingService,
    // Hack to instantiate it)
              private _firebaseService: FirebaseService,
              navParams: NavParams) {
    this._pageTypeToPage.set('ListPageViewModel', ListPage);
    this._pageTypeToPage.set('PlainTextPageViewModel', PlainTextPage);
    this._pageTypeToPage.set('EconomyPageViewModel', EconomyPage);
    this._pageTypeToPage.set('TechnicalInfoPageViewModel', TechnicalInfoPage);
    if (navParams.data.viewModel) {
      this._dataService.setViewModel(navParams.data.viewModel);
    }
  }

  public ngOnInit() {
    this._authService.addListener(this);
  }

  public ngOnDestroy() {
    this._authService.removeListener(this);
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewWillEnter() {
    this._subscription = this._dataService.getData().subscribe(
      (json) => {
        this.characterName = json.menu.characterName;
        this.pages = [];
        for (const p of json.pages)
          this.pages.push({ root: this._pageTypeToPage.get(p.__type), menuTitle: p.menuTitle });
      },
      (error) => this._logging.error('JSON parsing error: ' + JSON.stringify(error)),
    );
  }

  // tslint:disable-next-line:no-unused-variable
  public ionViewDidLeave() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }

  public openPage(page: PageData) {
    this._nav.setRoot(page.root, { id: page.menuTitle })
      .catch((err) => this._logging.error(JSON.stringify(err)));
  }

  public onSuccessfulLogin(_id: string) {}

  public onLogout() {
    this._navCtrl.setRoot(LoginPage);
  }

  public logout() {
    this._authService.logout();
  }
}
