import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { EventPage } from "../event/event";
import { EventCreationPage } from "../event-creation/event-creation";
import moment from 'moment';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html'
})

export class TodayPage {
  month: any;
  today: any;
  moment: any;
  clickedDate: any;
  selectedDays: any;
  displayedYear: any;
  displayedMonth: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, 
              private events: Events, private eventService : EventService, 
              private utils : Utils) {
    this.moment = moment;
    this.today = moment();
    this.displayedYear = this.today.get("year");
    this.displayedMonth = this.today.get("month");
    this.setSelectedDay(this.today, null);

    this.events.subscribe('event:update', () => {
        this.setSelectedDay(this.selectedDays[0].day, null);
    });
  }

  getDayName(day) {
    var response = "";
    ["yesterday", "today", "tomorrow"].forEach((dayName, i) => {
      if (this.moment(day).isSame(this.moment().add(i - 1, "days"), 'day')){
        response = dayName;
      }
    });
    return response;
  }

  refresh(refresher){
    this.eventService.reloadFromServer();
    this.setSelectedDay(this.selectedDays[0].day, refresher);
  }

  setSelectedDay(day, refresher) {
    var generateDays = date => [ date, moment(date).add(1, 'day'), moment(date).add(2, 'day')];

    this.eventService.getEventsForDays(generateDays(moment(day))).then(eventDays => {
      this.selectedDays = eventDays;

      this.selectedDays.forEach(d => {
          d.eventBar = [];
          var total = 0;

          this.utils.getCategories().forEach((c, i) => {
              var sum = d.events.filter(e => { return e.category == i; })
                          .map(e => { return this.utils.getDiff(e.startTime, e.endTime); })
                          .reduce((pv, cv) => pv+cv, 0) / 288;

              total += sum;
              d.eventBar.push({ color: this.utils.getCategoryColors(i), value: sum });
          });

          if (total > 100){
            this.utils.getCategories().forEach((c, i) => {
                d.eventBar[i].value = 100 * d.eventBar[i].value / total;
            });
          }
      });
      
      this.displayedMonth = this.selectedDays[0].day.get("month");
      this.displayedYear = this.selectedDays[0].day.get("year");
      this.setMonthArray(this.displayedYear, this.displayedMonth);
      if (refresher){
        refresher.complete();
      }
    }, data => {
      this.utils.showError(this.alertCtrl, "error", data.error);
      this.selectedDays = generateDays(moment(day)).map(d => { return { day: d, events: []}; });
      this.displayedMonth = this.selectedDays[0].day.get("month");
      this.displayedYear = this.selectedDays[0].day.get("year");
      this.setMonthArray(this.displayedYear, this.displayedMonth);
      if (refresher){
        refresher.complete();
      }
    });
  }

  getNextMonth(){
    if (++this.displayedMonth > 11) {
      this.displayedMonth = 0;
      this.displayedYear++;
    }

    this.setMonthArray(this.displayedYear, this.displayedMonth);
  }

  navigateToEvent(event){
    this.navCtrl.push(EventPage, { event: event });
  }

  getPreviousMonth(){
    if (--this.displayedMonth < 0){
      this.displayedMonth = 11;
      this.displayedYear--;
    }

    this.setMonthArray(this.displayedYear, this.displayedMonth);
  }

  setMonthArray(year, month) {
    var date = this.moment([year, month]).startOf('week');
    var monthData = [];

    while (this.monthArrayCondition(month, date)){
      var tmp = [];
      for (var j = 0; j < 7; j++){
        tmp.push(this.moment(date).add(j, 'days'));
      }
      monthData.push(tmp);
      date.add(7, 'days');
    }

    this.eventService.getDaysAndHasEvents(monthData).then(data => {
        this.month = data;
    }, data => {
        this.month = monthData.map(week => { return week.map(d => { return { day: d, hasEvents: false }; }); });
    });
  }

  private monthArrayCondition(month, date){
    if (month === 0){
      return date.month() === 11 || date.month() <= month;
    } else if (month === 11){
      return date.month() !== 0;
    } else {
      return date.month() <= month;
    }
  }

  onSwipeCalendar(event) {
    if (event.angle > 80 || event.angle < -80){
      this.getNextMonth();
    } else {
      this.getPreviousMonth();
    }
  }

  setClickedDate (day) {
    this.clickedDate = this.clickedDate === day ? null : day;
  }

  navigateToEventCreation(date) {
    var datetime = this.moment(date).format("YYYY-MM-DD[T]HH:mm[:00.000Z]");
    this.navCtrl.push(EventCreationPage, { date: datetime });
  }
}
