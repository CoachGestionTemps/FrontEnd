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

  constructor(public navCtrl: NavController, navParams: NavParams, public alertCtrl: AlertController,
              private eventService : EventService, private events: Events, private utils : Utils,
              private translate: TranslateService, private setting : SettingService) {
    this.moment = moment;
    this.event = navParams.get("event");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.passedTime = this.moment.utc((this.event.passedTime || 0) * 1000).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
  }

  navigateToEventStart(){
    this.navCtrl.push(EventStartPage, { event: this.event });
  }

  navigateToEventCreation(event) {
      this.navCtrl.push(EventCreationPage, { event: event });
  }

  promptDeleteEvent(event) {
      this.eventService.delete(event).then(data => {
          this.navCtrl.pop();
      }, data => {
          // TODO : Show Error
      });
  }

  getPassedTimeDuration(passedTime){
    var duration = this.moment.duration(passedTime);
    return duration.hours() + ":" + duration.minutes();
  }

  passedTimeUpdated(){
    this.event.passedTime = this.moment.utc(this.passedTime).diff(this.moment.utc(0)) / 1000;
    this.event.activityStartTime = null;
    this.eventService.edit(this.event).then(data => {

    }, data => {
      // TODO : Show error
    });
  }

  ionViewWillEnter(){
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
    this.tabBarElement.style.display = 'flex';
  }

  showDeletePrompt(event) {
    let prompt = this.alertCtrl.create({
      title: String(this.utils.translateWord('delete')),
      message: String(this.utils.translateWord('sureToDelete')),
      buttons: [
        {
          text: String(this.utils.translateWord('cancel')),
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: String(this.utils.translateWord('delete')),
          handler: data => {
            console.log('Saved clicked');
            this.promptDeleteEvent(event);
          }
        }
      ]
    });
    prompt.present();
  }

}
