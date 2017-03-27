import { Component } from '@angular/core';

import { NavParams, NavController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { Observable, Subject } from 'rxjs/Rx';
import moment from 'moment';

@Component({
  selector: 'page-event-start',
  templateUrl: 'event-start.html'
})

export class EventStartPage {
  event: any;
  moment: any;
  tabBarElement: any;
  playing: boolean;
  elapsedSeconds: any;
  timer: any;
  pauser: any;
  pausable; any;
  passedTime: number;

  constructor(public navCtrl: NavController, navParams: NavParams, private events: Events, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.event = navParams.get("event");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    // if the activity was started, not paused and we came back without refreshing the data from server
    this.passedTime = this.utils.getPassedTimeFromActivityStart(this.event);

    this.pauser = new Subject();
    this.timer = Observable.timer(0, 1000);
    this.pausable = this.pauser.switchMap(paused => paused ? Observable.never() : this.timer);
    this.pausable.subscribe(() => this.passedTime++ );
    this.play();
  }

  play(){
    if (this.event.activityStartTime){
      this.pauser.next(false);
      this.playing = true;
    } else {
      this.event.activityStartTime = this.moment().format(this.utils.dateFormat);
      this.eventService.edit(this.event).then(data => {
        this.pauser.next(false);
        this.playing = true;
      }, data => {
        // TODO : Show error message
      });
    }
  }

  pause(){
    this.utils.adjustEventPassedTimeOnPause(this.event)
    this.eventService.edit(this.event).then(data => {
      this.pauser.next(true);
      this.playing = false;
    }, data => {
        // TODO : Show error
    });
  }

  playPauseToggle(){
      this.playing ? this.pause() : this.play();
  }

  ionViewWillEnter(){
      this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
      this.tabBarElement.style.display = 'flex';
  }
}
