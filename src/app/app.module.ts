import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Firebase } from '@ionic-native/firebase';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home';
import { ListPage } from '../pages/list';
import { LoginPage } from '../pages/login';
import { PlainTextPage } from '../pages/plain-text';
import { PlaygroundPage } from '../pages/playground';
import { SelectorPage } from '../pages/selector';
import { MenuPage } from '../pages/menu';

import { ListItem } from '../elements/list-item';
import { LogoutButton } from "../elements/logout-button";

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { FirebaseService } from '../services/firebase.service';
import { QrCodeService } from '../services/qrcode.service';
import { AccessPage } from "../pages/access";
import { DbConnectionService } from "../services/db-connection.service";
import { LoggingService } from "../services/logging.service";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ListItem,
    LoginPage,
    LogoutButton,
    PlainTextPage,
    PlaygroundPage,
    SelectorPage,
    MenuPage,
    AccessPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PlainTextPage,
    PlaygroundPage,
    SelectorPage,
    MenuPage,
    AccessPage
  ],
  providers: [
    DbConnectionService,
    DataService,
    BackendService,
    QrCodeService,
    LoggingService,
    Firebase,
    FirebaseService,
    BarcodeScanner,
  ]
})
export class AppModule {}
