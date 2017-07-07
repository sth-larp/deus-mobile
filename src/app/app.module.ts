﻿ import { NgModule } from '@angular/core';
 import { HttpModule } from '@angular/http';
 import { BarcodeScanner } from '@ionic-native/barcode-scanner';
 import { Keyboard } from '@ionic-native/keyboard';
 import { IonicApp, IonicModule } from 'ionic-angular';

 import { MyApp } from './app.component';

 import { EconomyPage } from '../pages/economy';
 import { ListPage } from '../pages/list';
 import { LoginPage } from '../pages/login';
 import { MenuPage } from '../pages/menu';
 import { PlainTextPage } from '../pages/plain-text';

 import { ListItem } from '../elements/list-item';

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserModule } from '@angular/platform-browser';
 import { QrCode } from '../elements/qrcode';
 import { QuickActionButton } from '../elements/quick-action-button';
 import { QuickActions } from '../elements/quick-actions';
 import { BillPage } from '../pages/bill';
 import { DetailsPage } from '../pages/details';
 import { GeneralQRCodePage } from '../pages/general-qrcode';
 import { PassportPage } from '../pages/passport';
 import { TechnicalInfoPage } from '../pages/technical-info';
 import { AuthService } from '../services/auth.service';
 import { DataService } from '../services/data.service';
 import { EconomyService } from '../services/economy.service';
 import { FirebaseService } from '../services/firebase.service';
 import { LocalDataService } from '../services/local-data.service';
 import { LocalTimeService } from '../services/local-time.service';
 import { LoggingService } from '../services/logging.service';
 import { MonotonicTimeService } from '../services/monotonic-time.service';
 import { NativeStorageService } from '../services/native-storage.service';
 import { QrCodeScanService } from '../services/qrcode-scan.service';
 import { ServerTimeService } from '../services/server-time.service';

 @NgModule({
  declarations: [
    MyApp,
    ListPage,
    ListItem,
    QrCode,
    LoginPage,
    PlainTextPage,
    EconomyPage,
    BillPage,
    MenuPage,
    GeneralQRCodePage,
    TechnicalInfoPage,
    DetailsPage,
    PassportPage,
    QuickActionButton,
    QuickActions,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    LoginPage,
    PlainTextPage,
    EconomyPage,
    BillPage,
    MenuPage,
    GeneralQRCodePage,
    TechnicalInfoPage,
    DetailsPage,
    PassportPage,
    QrCode,
  ],
  providers: [
    AuthService,
    NativeStorageService,
    DataService,
    LocalDataService,
    QrCodeScanService,
    LoggingService,
    FirebaseService,
    BarcodeScanner,
    LocalTimeService,
    ServerTimeService,
    MonotonicTimeService,
    EconomyService,
    Keyboard,
  ],
})
export class AppModule {}
