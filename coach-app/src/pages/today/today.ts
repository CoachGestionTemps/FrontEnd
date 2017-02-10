import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { EventCategories } from '../../services/enums';
import moment from 'moment';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html'
})

export class TodayPage {
  selectedDays: any;
  month: any;
  displayedMonth: any;
  displayedYear: any;
  moment: any;
  today: any;

  constructor(public navCtrl: NavController) {
    this.moment = moment;
    this.today = moment();
    this.setSelectedDay(null);
    // TODO : Load custom calendar using this.selectedDays[0]
  }

  getDayName(day) {
    if (moment(day).isSame(moment().add(-1, "days"), 'day')){
      return "yesterday";
    } else if (moment(day).isSame(moment(), 'day')){
      return "today";
    } else if (moment(day).isSame(moment().add(1, "days"), 'day')){
      return "tomorrow";
    }
    return "";
  }

  setSelectedDay(day) {
    if (day){
      this.selectedDays = [moment(day), moment(day).add(1, 'day'), moment(day).add(2, 'day')];
    } else {
      this.selectedDays = [moment(), moment().add(1, 'day'), moment().add(2, 'day')];
    }
    this.displayedMonth = this.selectedDays[0].get("month");
    this.displayedYear = this.selectedDays[0].get("year");
    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth + 1);
  }

  getNextMonth(){
    if (this.displayedMonth == 11){
      this.displayedMonth = 0;
      this.displayedYear++;
    } else {
      this.displayedMonth++;
    }

    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth + 1);
    console.log(this.month);
  }

  getPreviousMonth(){
    if (this.displayedMonth == 0){
      this.displayedMonth = 11;
      this.displayedYear--;
    } else {
      this.displayedMonth--;
    }

    this.month = this.getMonthArray(this.displayedYear, this.displayedMonth + 1);
  }

  getMonthArray(year, month) {
    var date = new Date(year, month-1, 1);
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

    while (date.getMonth() == month-1) {
      date.setDate(date.getDate() + 1);

      if (date.getMonth() == month-1){
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
}
