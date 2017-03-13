import { Component } from '@angular/core';

import { TodayPage } from '../today/today';
import { WeekPage } from '../week/week';
import { ReportPage } from '../report/report';
import { EventService } from "../../services/event-service";
import { SettingService } from "../../services/setting-service";
import { Utils } from "../../services/utils";

import moment from 'moment';
import 'moment/src/locale/fr-ca';
import 'moment/src/locale/en-ca';


@Component({
  templateUrl: 'tabs.html',
  providers: [EventService, SettingService, Utils],
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TodayPage;
  tab2Root: any = WeekPage;
  tab3Root: any = ReportPage;

  constructor() {
      // TODO : Load from settings (either en-ca or fr-ca)
      moment.locale('fr-ca');
  }
}
