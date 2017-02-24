import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import moment from 'moment';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})
export class EventPage {
  event: any;
  moment: any;
  tabBarElement: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.event = navParams.get("event");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter()
    {

        this.tabBarElement.style.display = 'none';

    }

    ionViewWillLeave()
    {

        this.tabBarElement.style.display = 'flex';

    }
}
