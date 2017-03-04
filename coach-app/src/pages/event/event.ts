import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { EventStartPage } from '../event-start/event-start';
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

  navigateToEventStart(){
    this.navCtrl.push(EventStartPage, { event: this.event });
  }

  getPassedTimeDuration(passedTime){
    var duration = this.moment.duration(passedTime);
    return duration.hours() + ":" + duration.minutes();
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }
}
