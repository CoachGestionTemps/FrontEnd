import { Component } from '@angular/core';

import { TodayPage } from '../today/today';
import { WeekPage } from '../week/week';
import { ReportPage } from '../report/report';
import { SettingPage } from '../setting/setting';
import { EventService } from "../../services/event-service";
import { SettingService } from "../../services/setting-service";
import { Const } from "../../services/const";

import { Utils } from "../../services/utils";

import moment from 'moment';
import 'moment/src/locale/fr-ca';
import 'moment/src/locale/en-ca';


@Component({
  templateUrl: 'tabs.html',
  providers: [EventService, SettingService, Utils, Const],
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TodayPage;
  tab2Root: any = WeekPage;
  tab3Root: any = ReportPage;
  tab4Root: any = SettingPage;

  constructor(private setting : SettingService) {
      moment.locale(this.setting.getMomentLanguage());
  }
}
