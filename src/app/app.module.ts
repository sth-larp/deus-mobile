import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Firebase } from '@ionic-native/firebase';

import { MyApp } from './app.component';

import { ListPage } from '../pages/list';
import { LoginPage } from '../pages/login';
import { PlainTextPage } from '../pages/plain-text';
import { PlaygroundPage } from '../pages/playground';
import { MenuPage } from '../pages/menu';

import { ListItem } from '../elements/list-item';
import { LogoutButton } from "../elements/logout-button";

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { FirebaseService } from '../services/firebase.service';
import { QrCodeScanService } from '../services/qrcode-scan.service';
import { AccessPage } from "../pages/access";
import { DbConnectionService } from "../services/db-connection.service";
import { LoggingService } from "../services/logging.service";
import { ViewQrCodePage } from "../pages/view-qrcode";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CharacterPage } from "../pages/character";
import { TechnicalInfoPage } from "../pages/technical-info";
import { DetailsPage } from "../pages/details";
import { QuickActions } from "../elements/quick-actions";

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    ListItem,
    LoginPage,
    LogoutButton,
    PlainTextPage,
    PlaygroundPage,
    MenuPage,
    AccessPage,
    ViewQrCodePage,
    CharacterPage,
    TechnicalInfoPage,
    DetailsPage,
    QuickActions
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
    ListPage,
    LoginPage,
    PlainTextPage,
    PlaygroundPage,
    MenuPage,
    AccessPage,
    ViewQrCodePage,
    CharacterPage,
    TechnicalInfoPage,
    DetailsPage
  ],
  providers: [
    DbConnectionService,
    DataService,
    BackendService,
    QrCodeScanService,
    LoggingService,
    Firebase,
    FirebaseService,
    BarcodeScanner,
  ]
})
export class AppModule {}
