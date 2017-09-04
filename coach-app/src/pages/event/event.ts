import { Component, ViewChild } from '@angular/core';

import { NavParams, NavController, Events, AlertController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { SettingService } from '../../services/setting-service';
import { Utils } from '../../services/utils';
import { EventStartPage } from '../event-start/event-start';
import { EventCreationPage } from "../event-creation/event-creation";
import { EventCategories } from '../../services/enums';
import {TranslateService} from 'ng2-translate';
import moment from 'moment';


@Component({
  selector: 'page-event',
  templateUrl: 'event.html'
})

export class EventPage {
  @ViewChild('datePicker') datePicker;
  event: any;
  moment: any;
  tabBarElement: any;
  passedTime: any;
  eventCategories = EventCategories;
  summary: string;

  constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController,
              private eventService : EventService, private events: Events, private utils : Utils,
              private translate: TranslateService, private setting : SettingService) {
    this.moment = moment;
    this.event = navParams.get("event");
    this.summary = this.event.summary ? this.event.summary.replace("%skip%", "\n") : null;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.passedTime = this.moment.utc((this.event.passedTime || 0) * 1000).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
    this.events.subscribe('event:update', () => {
        var event = this.eventService.refreshEvent(this.event);
        if (event){
          this.event = event;
          this.passedTime = this.moment.utc((this.event.passedTime || 0) * 1000).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
        }
    });
  }

  navigateToEventStart(){
    this.navCtrl.push(EventStartPage, { event: this.event });
  }

  navigateToEventEdit(event) {
      this.navCtrl.push(EventCreationPage, { event: event });
  }

  promptDeleteEvent(event, deleteAllRepeatedEvents) {
      this.eventService.delete(event, deleteAllRepeatedEvents).then(data => {
          this.navCtrl.pop();
      }, data => {
          this.utils.showError(this.alertCtrl, "errorTitle", data.error);
      });
  }

  getPassedTimeDuration(passedTime){
    var duration = this.moment.duration(passedTime);
    return duration.hours() + ":" + duration.minutes();
  }

  passedTimeUpdated(){
    const newPassedTime = this.moment.utc(this.passedTime).diff(this.moment.utc(0)) / 1000;
    if (parseInt(this.event.passedTime) !== newPassedTime) {
      this.event.passedTime = newPassedTime;
      this.event.activityStartTime = null;
      this.eventService.edit(this.event).then(data => {
  
      }, data => {
            this.utils.showError(this.alertCtrl, "errorTitle", data.error);
      });
    }
  }

  completeActivity(){
    var eventTime = moment.duration(moment(this.event.endTime).diff(moment(this.event.startTime)));
    this.event.passedTime = eventTime.asSeconds();
    this.event.activityStartTime = null;
    this.eventService.edit(this.event).then(data => {
      
    }, data => {
          this.utils.showError(this.alertCtrl, "errorTitle", data.error);
    });
  }

  resetActivityTime(){
    this.event.passedTime = 0;
    this.event.activityStartTime = null;
    this.eventService.edit(this.event).then(data => {

    }, data => {
          this.utils.showError(this.alertCtrl, "errorTitle", data.error);
    });
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  getStartActivityButton(event) : string {
    return event.activityStartTime ? "seeCounter" : (event.passedTime == null ? 'startThisActivity' : 'resumeThisActivity')
  }

  showDeletePrompt(event) {
    let buttons = [
      {
        text: String(this.utils.translateWord('cancel'))
      },
      {
        text: String(this.utils.translateWord('delete')),
        handler: data => {
          this.promptDeleteEvent(event, false);
        }
      }
    ];

    if (event.parentId) {
      buttons.push({
          text: this.utils.translateWord('deleteAllRepeatedEvents'),
          handler: data => {
            this.promptDeleteEvent(event, true);
          }
      });
    }

    let prompt = this.alertCtrl.create({
      title: String(this.utils.translateWord('delete')),
      message: String(this.utils.translateWord(event.parentId ? 'sureToDeleteMulti' : 'sureToDelete')),
      buttons
    });
    prompt.present();
  }
}
