 import { NgModule } from '@angular/core';
 import { HttpModule } from '@angular/http';
 import { AppVersion } from '@ionic-native/app-version';
 import { BarcodeScanner } from '@ionic-native/barcode-scanner';
 import { Brightness } from '@ionic-native/brightness';
 import { Keyboard } from '@ionic-native/keyboard';
 import { Push } from '@ionic-native/push';
 import { IonicApp, IonicModule } from 'ionic-angular';

 import { MyApp } from './app.component';

 import { EconomyPage } from '../pages/economy';
 import { ListPage } from '../pages/list';
 import { LoginPage } from '../pages/login';
 import { MenuPage } from '../pages/menu';

 import { ListItem } from '../elements/list-item';
 import { SublistItem } from '../elements/sublist-item';
 import { SyncButton } from '../elements/sync-button';

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserModule } from '@angular/platform-browser';
 import { EnhancedActionSheetController, EnhancedAlertController } from '../elements/enhanced-controllers';
 import { QrCode } from '../elements/qrcode';
 import { QuickActionButton } from '../elements/quick-action-button';
 import { QuickActions } from '../elements/quick-actions';
 import { BillPage } from '../pages/bill';
 import { DetailsPage } from '../pages/details';
 import { GeneralQRCodePage } from '../pages/general-qrcode';
 import { PassportPage } from '../pages/passport';
 import { SublistPage } from '../pages/sublist';
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
 import { QrCodeScanService, QrCodeScanServiceCustom } from '../services/qrcode-scan.service';
 import { ServerTimeService } from '../services/server-time.service';
 import { UnreadService } from '../services/unread.service';

 @NgModule({
  declarations: [
    MyApp,
    ListPage,
    ListItem,
    SublistItem,
    QrCode,
    LoginPage,
    EconomyPage,
    BillPage,
    MenuPage,
    GeneralQRCodePage,
    TechnicalInfoPage,
    DetailsPage,
    SublistPage,
    PassportPage,
    QuickActionButton,
    QuickActions,
    SyncButton,
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
    EconomyPage,
    BillPage,
    MenuPage,
    GeneralQRCodePage,
    TechnicalInfoPage,
    DetailsPage,
    SublistPage,
    PassportPage,
    QrCode,
  ],
  providers: [
    AppVersion,
    AuthService,
    Brightness,
    NativeStorageService,
    DataService,
    LocalDataService,
    QrCodeScanService,
    QrCodeScanServiceCustom,
    LoggingService,
    Push,
    FirebaseService,
    BarcodeScanner,
    LocalTimeService,
    ServerTimeService,
    MonotonicTimeService,
    EconomyService,
    UnreadService,
    Keyboard,
    EnhancedActionSheetController,
    EnhancedAlertController,
  ],
})
export class AppModule {}
