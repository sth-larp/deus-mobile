import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ListItem } from '../pages/list-item/list-item';
import { PlainTextPage } from '../pages/plain-text/plain-text';
import { PlaygroundPage } from '../pages/playground/playground';
import { SelectorPage } from '../pages/selector/selector';
import { TabsPage } from '../pages/tabs/tabs';
import { DataService } from '../services/data-service';
import { TimeService } from '../time/time.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ListPage,
    ListItem,
    PlainTextPage,
    PlaygroundPage,
    SelectorPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ListPage,
    PlainTextPage,
    PlaygroundPage,
    SelectorPage,
    TabsPage
  ],
  providers: [
    DataService,
    TimeService
  ]
})
export class AppModule {}
