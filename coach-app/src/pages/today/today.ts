import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { EventCategories } from '../../services/enums';
import moment from 'moment';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html'
})

export class TodayPage {
  month: any;
  today: any;
  moment: any;
  events: any;
  clickedDate: any;
  selectedDays: any;
  displayedYear: any;
  displayedMonth: any;

  constructor(public navCtrl: NavController, private eventService : EventService) {
    this.moment = moment;
    this.today = moment();
    this.displayedYear = this.today.get("year");
    this.displayedMonth = this.today.get("month");

    this.eventService.getAll().then(events => {
      this.events = events;
      this.setSelectedDay(null);
    });
  }

  getDayName(day) {
    ["yesterday", "today", "tomorrow"].forEach((day, i) => {
      if (moment(day).isSame(moment().add(i - 1, "days"), 'day')){
        return day;
      }
    });
    return "";
  }

  setSelectedDay(day) {
    var generateDays = date => [ date, moment(date).add(1, 'day'), moment(date).add(2, 'day')];

    var days = day ? generateDays(moment(day)) : generateDays(moment());
    this.selectedDays = days.map(d => ({ day : d, events: this.getEventsForDay(d) }));

    this.displayedMonth = this.selectedDays[0].day.get("month");
    this.displayedYear = this.selectedDays[0].day.get("year");
    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth);
  }

  getNextMonth(){
    if (++this.displayedMonth > 11) {
      this.displayedMonth = 0;
      this.displayedYear++;
    }

    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth);
  }

  getPreviousMonth(){
    if (--this.displayedMonth < 0){
      this.displayedMonth = 11;
      this.displayedYear--;
    }

    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth);
  }

  getMonthArray(year, month) {
    var date = new Date(year, month, 1);
    var result = [];
    var preFill = [], postFill = [], tmp = [new Date(date.getTime())];

    while (date.getDay() < 6) {
      date.setDate(date.getDate() + 1);
      tmp.push(new Date(date.getTime()));
    }

    for (var i = 0; i < 7 - tmp.length; i++){
      preFill.push(null);
    }

    result.push(preFill.concat(tmp));

    tmp = [];

    while (date.getMonth() == month) {
      date.setDate(date.getDate() + 1);

      if (date.getMonth() == month){
        tmp.push(new Date(date.getTime()));
        if (date.getDay() == 6) {
          result.push(tmp);
          tmp = [];
        }
      }
    }

    for (var i = 0; i < 7 - tmp.length; i++){
      postFill.push(null);
    }

    result.push(tmp.concat(postFill));
    return result;
  }

  getCategoryClass(category){
    var categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work'];
    return 'category-' + categories[category];
  }

  setClickedDate (day) {
    this.clickedDate = this.clickedDate === day ? null : day;
  }

  getEventsForDay(day) {
    return this.events.filter(e => this.moment(day).isSame(this.moment(e.start_datetime), 'day'));
  }
}
