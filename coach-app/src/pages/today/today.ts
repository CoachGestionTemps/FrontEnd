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
  selectedDays: any;

  constructor(public navCtrl: NavController) {
    this.selectedDays = [moment(), moment().add(1, 'day'), moment().add(2, 'day')];

    // TODO : Load custom calendar using this.selectedDays[0]
  }

  getDayName(day) {
    if (moment(day).isSame(moment().add(-1, "days"), 'day')){
      return "yesterday";
    } else if (moment(day).isSame(moment(), 'day')){
      return "today";
    } else if (moment(day).isSame(moment().add(1, "days"), 'day')){
      return "tomorrow";
    }
    return "";
  }
}
