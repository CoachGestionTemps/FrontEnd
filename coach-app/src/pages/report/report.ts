import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { Chart } from 'chart.js';
import moment from 'moment';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {
  moment: any;
  minDate: any;
  maxDate: any;
  stats: any;
  rangetype: any;
  actualDate: any;
  events: any;
  selectionTitle: any;
  pieChart: any;
  chartData: number[];
  chartLabels: string[];
  viewLoaded: boolean;

  @ViewChild('pieCanvas') pieCanvas;

  constructor(public navCtrl: NavController, private eventService : EventService, private utils : Utils) {
    this.moment = moment;
    this.rangetype = "week";
    this.actualDate = this.moment();
    this.chartData = [];
    this.chartLabels = [];
    this.viewLoaded = false;
    this.refresh(null);
  }

  refresh(refresher){
    this.eventService.getAll().then(events => {
      this.events = events;
      this.setActualSelection();
      if (refresher) {
          refresher.complete();
      }
    });
  }

  setActualSelection(){
    if (this.rangetype === "week"){
      this.minDate = this.moment(this.actualDate).startOf('week'); 
      this.maxDate = this.moment(this.actualDate).endOf('week');
      this.selectionTitle = this.minDate.format("D") + " - " + this.maxDate.format("D MMMM YYYY");
    } else if (this.rangetype === "month") {
      this.minDate = this.moment(this.actualDate).startOf('month'); 
      this.maxDate = this.moment(this.actualDate).endOf('month');
      this.selectionTitle = this.maxDate.format("MMMM YYYY");
    } else if (this.rangetype === "session"){
      var daterange = this.getSessionRanges();
      this.minDate = daterange[0];
      this.maxDate = daterange[1];
    }

    var stats = [];
    var chartLabels = [];
    var chartData = [];

    this.events.filter(e => this.moment(e.start_time).isAfter(this.minDate) && this.moment(e.end_time).isBefore(this.maxDate)).forEach(e => {
      if (stats[e.category]){
        chartData[e.category] += e.passed_time || 0;
        stats[e.category].passed_time += chartData[e.category];
        stats[e.category].plannedTime += this.moment(e.end_time).diff(this.moment(e.start_time), 'minutes');
      } else {
        chartLabels[e.category] = e.category;
        chartData[e.category] = e.passed_time || 0;
        stats[e.category] = {
          passed_time: chartData[e.category],
          plannedTime: this.moment(e.end_time).diff(this.moment(e.start_time), 'minutes'),
          categoryKey: e.category
        }
      }
    });

    this.stats = stats.filter(e => e);
    this.updateChart(chartLabels.filter(e => e != null), chartData.filter(e => e != null));
  }

  updateChart(chartLabels, chartData){
    if (this.viewLoaded){
      
      if (this.pieChart){
        this.pieChart.destroy();
      }

      this.pieChart = new Chart(this.pieCanvas.nativeElement, {
            type: 'pie',
            data: {
                labels: chartLabels.map(l => this.utils.getCategoryName(l)),
                datasets: [{
                    label: '# of Votes',
                    data: chartData,
                    backgroundColor: chartLabels.map(l => this.utils.getCategoryColors(l))
                }]
            }
        });
    }
  }

  ionViewDidLoad(){
    this.viewLoaded = true;
  }

  getSessionRanges(){
    var endOfWinter = this.moment([this.actualDate.year(), 4]).subtract(7, 'days');
    var endOfSummer = this.moment([this.actualDate.year(), 8]).subtract(7, 'days');

    if (this.actualDate.isBefore(endOfWinter)){
      // january first - last week of april
      this.selectionTitle = "Winter";
      return [this.moment([this.actualDate.year()]), endOfWinter];
    } else if (this.actualDate.isBefore(endOfSummer)){
      // last week of april - last week of august
      this.selectionTitle = "Summer";
      return [endOfWinter,  endOfSummer];
    } else {
      // last week of august - january first of next year
      this.selectionTitle = "Fall";
      return [endOfSummer, this.moment([this.actualDate.year() + 1])];
    }
  }

  getNextSelection(){
    if (this.rangetype === "week"){
      this.actualDate.add(7, 'day');
    } else if (this.rangetype === "month") {
      this.actualDate.add(1, 'month').startOf('month');
    } else if (this.rangetype === "session"){
      this.actualDate.add(4, 'month');
    }

    this.setActualSelection();
  }

  getPreviousSelection(){
    if (this.rangetype === "week"){
      this.actualDate.add(-7, 'day');
    } else if (this.rangetype === "month") {
      this.actualDate.add(-1, 'month');
    } else if (this.rangetype === "session"){
      this.actualDate.add(-4, 'month');
    }

    this.setActualSelection();
  }
}
