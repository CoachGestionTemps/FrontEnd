import { Component } from '@angular/core';

import { TodayPage } from '../today/today';
import { WeekPage } from '../week/week';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TodayPage;
  tab2Root: any = WeekPage;

  constructor() {

  }
}
