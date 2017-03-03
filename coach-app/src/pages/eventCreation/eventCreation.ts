import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { WeekPage } from "../week/week";
import moment from 'moment';

@Component({
  selector: 'page-eventCreation',
  templateUrl: 'eventCreation.html'
})
export class EventCreationPage {
  date:any;
  hour:any;
  moment: any;
  tabBarElement: any;
  startTime: any;
  endTime: any;
  reminder: any;
  activityType: any;
  title: any;
  location: any;
  description: any;

  constructor(public navCtrl: NavController, navParams: NavParams, week: WeekPage, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.date = navParams.get("date");
    this.hour = navParams.get("hour");
    var dateStartTime = this.moment(this.date.day).toDate();
    var dateEndTime = this.moment(this.date.day).toDate();
    dateStartTime.setUTCHours(this.hour, 0);
    dateEndTime.setHours(this.hour - 4  , 0);
    this.startTime = dateStartTime.toISOString();
    this.endTime = dateEndTime.toISOString();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.reminder = "none";
    this.activityType = 0;
  }

  createEvent() {
    //TODO : find why we need to add 5
    var startTime = moment(this.startTime);
    startTime.add(5, 'hours');
    var endTime = moment(this.endTime);
    endTime.add(5, 'hours');
    var event =
      {
        start_datetime: startTime,
        end_datetime: endTime,
        category: this.activityType,
        user_id: 1,
        title: this.title,
        passed_time: null,
        summary: this.description,
        location: this.location
    };
    this.eventService.add(event);
    this.week.refreshWeekEvents();
    this.navCtrl.pop();
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
