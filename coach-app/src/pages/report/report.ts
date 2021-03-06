import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { SettingService } from "../../services/setting-service";
import { EventCategories } from '../../services/enums';
import { Chart } from 'chart.js';
import moment from 'moment';

@Component({
    selector: 'page-report',
    templateUrl: 'report.html'
})

export class ReportPage {
    minDate: moment.Moment;
    maxDate: moment.Moment;
    actualDate: moment.Moment;
    selectionTitle: string;
    rangetype: string;
    chartData: number[];
    chartLabels: string[];
    viewLoaded: boolean;
    eventCategories = EventCategories;
    stats: any[];
    events: any[];
    moment: any;
    pieChart: any;
    @ViewChild('pieCanvas') pieCanvas;

    constructor(public navCtrl: NavController, private eventService: EventService, private utils: Utils, private setting: SettingService) {
        this.moment = moment;
        this.rangetype = "day";
        this.actualDate = this.moment();
        this.chartData = [];
        this.chartLabels = [];
        this.viewLoaded = false;
        this.refresh(null);
    }

    refresh(refresher) {
        if (this.rangetype === "day") {
            this.minDate = this.moment(this.actualDate).startOf('day');
            this.maxDate = this.moment(this.actualDate).endOf('day');
            this.selectionTitle = this.maxDate.format("LL");
        } else if (this.rangetype === "week") {
            this.minDate = this.moment(this.actualDate).startOf('week');
            this.maxDate = this.moment(this.actualDate).endOf('week');
            this.selectionTitle = this.minDate.format("D") + " - " + this.maxDate.format("D MMMM YYYY");
        } else if (this.rangetype === "session") {
            var daterange = this.getSessionRanges();
            this.minDate = daterange[0];
            this.maxDate = daterange[1];
        }

        if (refresher) {
            this.eventService.reloadFromServer();
        }

        this.eventService.getEventsForDateRange(this.minDate, this.maxDate).then(events => {
            this.events = events;
            this.setActualSelection();

            if (refresher) {
                refresher.complete();
            }
        });
    }

    setActualSelection() {
        var stats = [];
        var chartLabels = [];
        var chartData = [];

        this.events.forEach(e => {
            var plannedTime = this.moment(e.endTime).diff(this.moment(e.startTime), 'seconds');
            var passedTime = !this.setting.isSPO() && e.category == this.eventCategories.Class ?
                plannedTime : this.utils.getPassedTimeFromActivityStart(e);

            if (stats[e.category]) {
                chartData[e.category] += passedTime;
                stats[e.category].plannedTime += plannedTime;
                stats[e.category].passedTime += passedTime;
            } else {
                chartLabels[e.category] = e.category;
                chartData[e.category] = passedTime;
                stats[e.category] = {
                    passedTime: passedTime,
                    plannedTime: plannedTime,
                    categoryKey: e.category
                }
            }
        });

        this.stats = stats.filter(e => e);
        this.updateChart(chartLabels.filter(e => e != null), chartData.filter(e => e != null));
    }

    onSwipeReport(event) {
      if (event.angle > 80 || event.angle < -80){
        this.getNextSelection();
      } else {
        this.getPreviousSelection()
      }
    }

    updateChart(chartLabels, chartData) {
        if (this.viewLoaded) {
            if (this.pieChart) {
                this.pieChart.destroy();
            }
            if (this.anyStatNonNull()) {
                this.pieChart = new Chart(this.pieCanvas.nativeElement, {
                    type: 'pie',
                    data: {
                        labels: chartLabels.map((l, i) => this.utils.getCategoryName(l) + ": " + this.utils.getFormattedTime(chartData[i])),
                        datasets: [{
                            data: chartData,
                            backgroundColor: chartLabels.map(l => this.utils.getCategoryColors(l))
                        }]
                    },
                    options: { tooltips: { enabled: false } }
                });
            }
        }
    }

    getStatHeader() {
        return this.anyStatNonNull() ? 'dedicatedTime' : 'noDedicatedTime';
    }

    ionViewDidLoad() {
        this.viewLoaded = true;
    }

    anyStatNonNull() {
        // TODO : change for passedTime method in utils
        return this.stats.some(o => o.passedTime > 0);
    }

    getSessionRanges() {
        var endOfWinter = this.moment([this.actualDate.year(), 4]).subtract(7, 'days');
        var endOfSummer = this.moment([this.actualDate.year(), 8]).subtract(7, 'days');

        if (this.actualDate.isBefore(endOfWinter)) {
            // january first - last week of april
            this.selectionTitle = this.utils.translateWord("winter") + " " + this.actualDate.year();
            return [this.moment([this.actualDate.year()]), endOfWinter];
        } else if (this.actualDate.isBefore(endOfSummer)) {
            // last week of april - last week of august
            this.selectionTitle = this.utils.translateWord("summer") + " " + this.actualDate.year();
            return [endOfWinter, endOfSummer];
        } else {
            // last week of august - january first of next year
            this.selectionTitle = this.utils.translateWord("fall") + " " + this.actualDate.year();
            return [endOfSummer, this.moment([this.actualDate.year() + 1])];
        }
    }

    getNextSelection() {
        if (this.rangetype === "day") {
            this.actualDate.add(1, 'day');
        } else if (this.rangetype === "week") {
            this.actualDate.add(7, 'day');
        } else if (this.rangetype === "session") {
            this.actualDate.add(4, 'month');
        }

        this.refresh(null);
    }

    getPreviousSelection() {
        if (this.rangetype === "day") {
            this.actualDate.add(-1, 'day');
        } else if (this.rangetype === "week") {
            this.actualDate.add(-7, 'day');
        } else if (this.rangetype === "session") {
            this.actualDate.add(-4, 'month');
        }

        this.refresh(null);
    }
}
