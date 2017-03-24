import { Component } from '@angular/core';

import { NavParams, NavController, AlertController, Events } from 'ionic-angular';
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
  event: any;
  eventDate: any;
  original_start_time: string;

  constructor(public navCtrl: NavController, navParams: NavParams, private events: Events, private utils : Utils, private eventService : EventService) {
    this.moment = moment;
    // if edit an event
    if (this.event = navParams.get("event")) {
      this.title = this.event.title;
      this.location = this.event.location;
      this.description = this.event.summary;
      this.activityType = this.event.category;
      this.original_start_time = this.event.start_time;
      this.eventDate = this.moment(this.event.start_time, utils.dateFormat).format(utils.utcDateFormat);
      this.startTime = this.moment(this.event.start_time, utils.dateFormat).format(utils.utcDateFormat);
      var dateEndTime = this.moment(this.event.end_time, utils.dateFormat);
      this.endTime = dateEndTime.format(utils.utcDateFormat);
    } else { // if create a new event
      this.date = navParams.get("date");
      this.eventDate = this.moment(this.date).format(utils.utcDateFormat);
      this.startTime = this.moment(this.date).format(utils.utcDateFormat);
      var dateEndTime = this.moment(this.date);
      dateEndTime.add(1, 'hour');
      this.endTime = dateEndTime.format(utils.utcDateFormat);
      this.activityType = 0;
    }
    this.date = navParams.get("date");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.reminder = "none";
  }

  saveEvent(){
    // TODO : Check if title, startTime and endTime are valid. Check if startTime < endTime
    // If Not -> Show error message

    this.startTime = this.eventDate.split("T")[0] + 'T' + this.startTime.split("T")[1];
    this.endTime = this.eventDate.split("T")[0] + 'T' + this.endTime.split("T")[1];
    var start_datetime = this.moment(this.startTime);
    var end_datetime = this.moment(this.endTime);

    var eventToSave = {
      start_time: start_datetime.format(this.utils.dateFormat),
      end_time: end_datetime.format(this.utils.dateFormat),
      category: this.activityType,
      title: this.title,
      passed_time: null,
      summary: this.description,
      location: this.location
    };

    if (this.event){
      eventToSave['id'] = this.event.id;
      eventToSave['user_id'] = this.event.user_id;
      eventToSave['original_start_time'] = this.original_start_time;
      this.eventService.edit(eventToSave).then(data => {
        this.navCtrl.pop();
      }, data => {
        // TODO : Show Error
      });
    } else {
      this.eventService.add(eventToSave).then(data => {
        this.navCtrl.pop();
      }, data => {
        // TODO : Show error
      });
    }
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
