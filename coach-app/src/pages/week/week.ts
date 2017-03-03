import { Component } from '@angular/core';

import { NavController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { EventPage } from "../event/event";
import { EventCreationPage } from "../eventCreation/eventCreation";
import moment from 'moment';

@Component({
  selector: 'page-week',
  templateUrl: 'week.html'
})
export class WeekPage {
  week: any;
  today: any;
  moment: any;
  displayedYear: any;
  displayedMonth: any;
  hours: any;

  constructor(public navCtrl: NavController, private events : Events, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.today = moment();
    this.displayedYear = this.today.get("year");
    this.displayedMonth = this.today.get("month");
    this.hours = this.utils.generateHours();
    this.setSelectedWeek(this.today);


    this.events.subscribe('event:update', () => {
        this.setSelectedWeek(this.week[0].day);
    });
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

    this.eventService.getEventsForDays(days).then(dayEvents => {
      for (var dayEvent of dayEvents) {
        dayEvent.indexedEvents = new Array(24);
        for (var event of dayEvent.events){
          var hour = moment(event.start_datetime).get('h');
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
    });
  }

  refreshWeekEvents()
  {
    this.setSelectedWeek(moment(this.week[0].day));
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

  getEventWidth(date, h){
    return ((100 / (this.getIndexedEvents(date, h).length)) - 1) + "%";
  }

  getEventMargin(event){
    return ((this.moment(event.start_datetime).minutes() / 60) * 50) + 'px';
  }

  getEventHeight(event){
    var diff = this.moment.duration(this.moment(event.end_datetime).diff(this.moment(event.start_datetime))).asMinutes();
    return ((diff / 60) * 100) + '%';
  }

  navigateToEvent(event, htmlEvent) {
    htmlEvent.stopPropagation();
    this.navCtrl.push(EventPage, { event: event });
  }

  navigateToEventCreation(date, hour) {
    var datetime = this.moment(date.format("MM-DD-YYYY"), "MM-DD-YYYY");
    datetime.set({ hour: hour});
    this.navCtrl.push(EventCreationPage, { date: datetime });
  }
}
