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
  clickedDate: any;
  selectedEvents: any;
  pastSelectedDay: any;

  events = [
  {
    id: 0,
    start_datetime: moment().format("LLL"),
    end_datetime: null,
    category: 0,
    user_id: 1,
    title: "Fête de môman",
    passed_time: null,
    summary: "À chaque année, ma mère vieillit d'un année... Encore et encore!",
    location: "123 ave DesMères, Ville Père, Q1W 2E3, Qc, Ca",
    parent_id: 0,
    date: moment().add(1, "days")
  },
  {
    id: 2,
    start_datetime: moment().date(moment().date() + 1).format("LLL"),
    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 2).format("LLL"),
    category: 2,
    user_id: 1,
    title: "Étude pour ADM111",
    passed_time: null,
    summary: "Pu capable de ce cours-là...",
    location: "Chez nous...",
    parent_id: 2,
    date: moment().add(1, "days")
  },
  {
    id: 3,
    start_datetime: moment().hour(moment().hour() + 2).format("LLL"),
    end_datetime: moment().hour(moment().hour() + 4).format("LLL"),
    category: 1,
    user_id: 1,
    title: "ADM111",
    passed_time: null,
    summary: "Principe d'administration",
    location: "K3-2021",
    parent_id: 3,
    date: moment()
  },
  {
    id: 4,
    start_datetime: moment().hour(moment().hour() + 4).format("LLL"),
    end_datetime: moment().hour(moment().hour() + 6).format("LLL"),
    category: 3,
    user_id: 1,
    title: "Volley!",
    passed_time: null,
    summary: null,
    location: "Centre Sportif",
    parent_id: 4,
    date: moment()
  },
  {
    id: 5,
    start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format("LLL"),
    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format("LLL"),
    category: 5,
    user_id: 1,
    title: "Shift McDo",
    passed_time: null,
    summary: null,
    location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
    parent_id: 5,
    date: moment()
  },
  {
    id: 6,
    start_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 2).format("LLL"),
    end_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 4).format("LLL"),
    category: 1,
    user_id: 1,
    title: "ADM111",
    passed_time: null,
    summary: "Principe d'administration",
    location: "K3-2021",
    parent_id: 3,
    date: moment()
  },
  {
    id: 7,
    start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format("LLL"),
    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format("LLL"),
    category: 5,
    user_id: 2,
    title: "Shift Subway",
    passed_time: null,
    summary: null,
    location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
    parent_id: 7,
    date: moment()
  },
]



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


  setClickedDate(day){
    this.selectedEvents = [];
    this.clickedDate = day;

    if (!day.isSame(this.pastSelectedDay)) {
      // ToDo : need to get real way to get events

      for (var i=0; i < this.events.length; i++) {
        if (moment(day).isSame(this.events[i].date, 'day')) {
          this.selectedEvents.push(this.events[i]);
        }
      }
      this.pastSelectedDay = day;
    }
    else {
      this.pastSelectedDay = null;
    }
  }
}
