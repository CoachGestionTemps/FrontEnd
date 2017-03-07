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

  constructor(public navCtrl: NavController, navParams: NavParams, private events: Events, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.event = navParams.get("event");
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.event.passed_time = this.event.passed_time || 0;
    this.pauser = new Subject();
    this.timer = Observable.timer(0, 1000);
    this.pausable = this.pauser.switchMap(paused => paused ? Observable.never() : this.timer);
    this.pausable.subscribe(() => this.event.passed_time++);
    this.play();
  }

  play(){
    this.pauser.next(false);
    this.playing = true;
  }

  pause(){
    this.pauser.next(true);
    this.playing = false;
    this.eventService.edit(this.event);
  }

  playPauseToggle(){
      this.playing ? this.pause() : this.play();
  }

  ionViewWillEnter(){
      this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave(){
      this.tabBarElement.style.display = 'flex';
      if (this.playing){
          this.pause();
      }
  }
}
