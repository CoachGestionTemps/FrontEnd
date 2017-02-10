import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { EventCategories } from '../../services/enums';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html'
})

export class TodayPage {

  constructor(public navCtrl: NavController) {

  }

}
