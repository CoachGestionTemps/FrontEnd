import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
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

  constructor(public navCtrl: NavController, private eventService : EventService) {
    this.moment = moment;
    this.today = moment();
    this.displayedYear = this.today.get("year");
    this.displayedMonth = this.today.get("month");
    this.hours = this.generateHours();
    this.setSelectedWeek(this.today);
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
      days.push(moment(day).add(dayOfWeek, 'day'));
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

  generateHours() {
    var hours = [];
    for (var j = 1; j <= 24; j++){
      hours.push(j % 24);
    }
    return hours;
  }

  displayHour(h){
    return ('0' + h).slice(-2) + ":00";
  }

  getNextWeek(){
    
  }

  getIndexedEvents(date, h){
    return date.indexedEvents[h] || [];
  }

  getPreviousMonth(){
    
  }

  getEventMargin(event){
    return ((this.moment(event.start_datetime).minutes() / 60) * 50) + 'px';
  }

  getEventHeight(event){
    var diff = this.moment.duration(this.moment(event.end_datetime).diff(this.moment(event.start_datetime))).asMinutes();
    return ((diff / 60) * 100) + '%';
  }

  getCategoryClass(category){
    var categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work'];
    return 'category-' + categories[category];
  }
}
