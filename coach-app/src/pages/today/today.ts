import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { EventCategories } from '../../services/enums';
import moment from 'moment';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html'
})

export class TodayPage {

  today;
  tomorrow;
  afterTomorrow;

  constructor(public navCtrl: NavController) {
    this.today = moment();
    this.tomorrow = moment().add(1, 'day');
    this.afterTomorrow = moment().add(2, 'day');
  }

}
