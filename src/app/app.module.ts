import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Firebase } from '@ionic-native/firebase';

import { MyApp } from './app.component';

import { ListPage } from '../pages/list';
import { LoginPage } from '../pages/login';
import { PlainTextPage } from '../pages/plain-text';
import { EconomyPage } from '../pages/economy';
import { MenuPage } from '../pages/menu';

import { ListItem } from '../elements/list-item';

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { FirebaseService } from '../services/firebase.service';
import { QrCodeScanService } from '../services/qrcode-scan.service';
import { DbConnectionService } from "../services/db-connection.service";
import { LoggingService } from "../services/logging.service";
import { ViewQrCodePage } from "../pages/view-qrcode";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CharacterPage } from "../pages/character";
import { TechnicalInfoPage } from "../pages/technical-info";
import { DetailsPage } from "../pages/details";
import { QuickActions } from "../elements/quick-actions";
import { ServerTimeService } from "../services/server-time.service";
import { LocalTimeService } from "../services/local-time.service";
import { NativeStorageService } from "../services/native-storage.service";
import { MonotonicTimeService } from "../services/monotonic-time.service";
import { GeneralQRCodePage } from "../pages/general-qrcode";

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    ListItem,
    LoginPage,
    PlainTextPage,
    EconomyPage,
    MenuPage,
    GeneralQRCodePage,
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
    EconomyPage,
    MenuPage,
    GeneralQRCodePage,
    ViewQrCodePage,
    CharacterPage,
    TechnicalInfoPage,
    DetailsPage
  ],
  providers: [
    NativeStorageService,
    DbConnectionService,
    DataService,
    BackendService,
    QrCodeScanService,
    LoggingService,
    Firebase,
    FirebaseService,
    BarcodeScanner,
    LocalTimeService,
    ServerTimeService,
    MonotonicTimeService
  ]
})
export class AppModule {}
