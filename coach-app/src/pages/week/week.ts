import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { EventPage } from "../event/event";
import { EventCreationPage } from "../event-creation/event-creation";
import moment from 'moment';

@Component({
  selector: 'page-week',
  templateUrl: 'week.html'
})
export class WeekPage {
  @ViewChild('week-content') private container: ElementRef;
  week: any;
  today: any;
  moment: any;
  displayedYear: any;
  displayedMonth: any;
  hours: any;
  days: any[];

  constructor(public navCtrl: NavController, public alertCtrl : AlertController, private events : Events, 
              private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.today = moment();
    this.displayedYear = this.today.get("year");
    this.displayedMonth = this.today.get("month");
    this.hours = this.utils.generateHours();
    this.setSelectedWeek(this.today);

    this.events.subscribe('event:update', () => {
        this.getEvents(null);
    });
  }

  refresh(refresher){
    this.eventService.reloadFromServer();
    this.getEvents(refresher);
  }

  setSelectedWeek(day) {
    var days = [];
    var dayOfWeek = day.day();
    var i: any;

    for (i = 0; i < dayOfWeek; i++){
      days.push(moment(day).add(-dayOfWeek + i, 'day'));
    }

    days.push(day);

    for (i = dayOfWeek + 1; i < 7; i++){
      days.push(moment(day).add(i - dayOfWeek, 'day'));
    }
    this.days = days;
    this.getEvents(null);
  }

  getEvents(refresher){
      this.eventService.getEventsForDays(this.days).then(dayEvents => {
          for (var dayEvent of dayEvents) {
            dayEvent.indexedEvents = new Array(24);
            for (var event of dayEvent.events){
              var hour = moment(event.startTime).get('h');
              if (dayEvent.indexedEvents[hour]){
                dayEvent.indexedEvents[hour].push(event);
              } else {
                dayEvent.indexedEvents[hour] = [event];
              }
            }
          }

          this.week = dayEvents;
          this.displayedMonth = this.week[6].day.get("month");
          this.displayedYear = this.week[6].day.get("year");
          if (refresher){
            refresher.complete();
          }
      }, data => {
          this.utils.showError(this.alertCtrl, "error", data.error);
          this.week = this.days.map(d => { return { day: d, events: [], indexedEvents: new Array(24)}; });
          this.displayedMonth = this.week[6].day.get("month");
          this.displayedYear = this.week[6].day.get("year");
          if (refresher){
            refresher.complete();
          }
      });
  }

  getNextWeek(){
    this.setSelectedWeek(moment(this.week[0].day).add(7, 'days'))
  }

  getPreviousWeek(){
    this.setSelectedWeek(moment(this.week[0].day).add(-7, 'days'))
  }

  getIndexedEvents(date, h){
    return date.indexedEvents[h] || [];
  }

  getEventMargin(event){
    return ((this.moment(event.startTime).minutes() / 60) * 50) + 'px';
  }

  getEventHeight(event){
    var diff = this.moment.duration(this.moment(event.endTime).diff(this.moment(event.startTime))).asMinutes();
    return ((diff / 60) * 100) + '%';
  }

  navigateToEvent(event, htmlEvent) {
    htmlEvent.stopPropagation();
    this.navCtrl.push(EventPage, { event: event });
  }

  onWeekSlide(event) {
    if (event.angle > 80 || event.angle < -80){
      this.getNextWeek();
    } else {
      this.getPreviousWeek();
    }
  }

  navigateToEventCreation(date, hour) {
    // REFACTOR : Est-ce nécessaire de recréer une date?
    var datetime = this.moment(date.format("MM-DD-YYYY"), "MM-DD-YYYY");
    datetime.set({ hour: hour});
    this.navCtrl.push(EventCreationPage, { date: datetime });
  }

  ionViewDidLoad(){
    document.getElementById(this.moment().format("H") + "H").scrollIntoView();
  }
}
