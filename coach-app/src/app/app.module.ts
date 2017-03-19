import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http } from "@angular/http";
import { WeekPage } from '../pages/week/week';
import { TodayPage } from '../pages/today/today';
import { ReportPage } from '../pages/report/report';
import { EventPage } from '../pages/event/event';
import { SettingPage } from '../pages/setting/setting';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { EventCreationPage } from "../pages/event-creation/event-creation";
import { EventStartPage } from "../pages/event-start/event-start";
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import * as Enums from "../services/enums";

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    WeekPage,
    TodayPage,
    ReportPage,
    EventPage,
    SettingPage,
    EventCreationPage,
    WalkthroughPage,
    EventStartPage,
    TabsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WeekPage,
    TodayPage,
    ReportPage,
    EventPage,
    SettingPage,
    EventCreationPage,
    WalkthroughPage,
    EventStartPage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
