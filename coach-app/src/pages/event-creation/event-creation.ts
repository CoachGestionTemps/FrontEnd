import { Component } from '@angular/core';

import { NavParams, NavController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import moment from 'moment';

@Component({
  selector: 'page-event-creation',
  templateUrl: 'event-creation.html'
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
  headerTitle: any;
  event: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private events: Events, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    if (this.event = navParams.get("event")) {
      this.title = this.event.title;
      this.location = this.event.location;
      this.description = this.event.summary;
      this.activityType = this.event.category;
      this.startTime = this.moment(this.event.start_datetime).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
      var dateEndTime = this.moment(this.event.end_datetime);
      this.endTime = dateEndTime.format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
    } else {
      this.startTime = this.moment(this.date).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
      var dateEndTime = this.moment(this.date);
      dateEndTime.add(1, 'hour');
      this.endTime = dateEndTime.format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
      this.activityType = 0;
    }
    this.date = navParams.get("date");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.reminder = "none";
  }

  saveEvent(){
      var start_datetime = this.moment(this.startTime);
      var end_datetime = this.moment(this.endTime);
      start_datetime.add(-start_datetime.utcOffset(), 'minute');
      end_datetime.add(-end_datetime.utcOffset(), 'minute');

    if (this.event){
      var eventModify = {
        id: this.event.id,
        start_datetime: start_datetime.format(),
        end_datetime: end_datetime.format(),
        category: this.activityType,
        user_id: 1,
        title: this.title,
        passed_time: null,
        summary: this.description,
        location: this.location
      };
      this.eventService.edit(eventModify);
      this.navCtrl.pop();
    }
    else{
      var eventCreated = {
        start_datetime: start_datetime.format(),
        end_datetime: end_datetime.format(),
        category: this.activityType,
        user_id: 1,
        title: this.title,
        passed_time: null,
        summary: this.description,
        location: this.location
      };
      this.eventService.add(eventCreated);
    }
    this.events.publish('event:update');
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
