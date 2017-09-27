import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController, Events } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { Const } from '../../services/const';
import moment from 'moment';

@Component({
    selector: 'page-event-creation',
    templateUrl: 'event-creation.html'
})

export class EventCreationPage {
    date: any;
    hour: any;
    moment: any;
    repetition: string;
    repetitionValues: any;
    tabBarElement: any;
    startTime: any;
    endTime: any;
    activityType: any;
    title: any;
    location: any;
    description: any;
    event: any;
    eventDate: any;
    originalStartTime: string;
    isLoading: boolean;

    constructor(public navCtrl: NavController, navParams: NavParams, private events: Events, private utils: Utils,
        private eventService: EventService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private cnst: Const) {
        this.moment = moment;
        // TODO : Cleanup this logic
        // if edit an event
        if (this.event = navParams.get("event")) {
            this.title = this.event.title;
            this.location = this.event.location;
            this.description = this.event.summary;
            this.activityType = this.event.category;
            this.originalStartTime = this.event.startTime;
            this.eventDate = this.moment(this.event.startTime, cnst.dateFormat).format(cnst.utcDateFormat);
            this.startTime = this.moment(this.event.startTime, cnst.dateFormat).format(cnst.utcDateFormat);
            var dateEndTime = this.moment(this.event.endTime, cnst.dateFormat);
            this.endTime = dateEndTime.format(cnst.utcDateFormat);
        } else { // if create a new event
            this.date = navParams.get("date");
            this.eventDate = this.moment(this.date).format(cnst.utcDateFormat);
            this.startTime = this.moment(this.date).format(cnst.utcDateFormat);
            var dateEndTime = this.moment(this.date);
            dateEndTime.add(1, 'hour');
            this.endTime = dateEndTime.format(cnst.utcDateFormat);
            this.activityType = 0;
            this.repetition = "0";
            this.repetitionValues = Array(16).fill(0).map((_, idx) => {
                return {
                    value: idx,
                    label: idx === 0 ? "never" : (idx > 1 ? "times" : "time")
                }
            });
        }
        this.date = navParams.get("date");
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }

    saveAllEventsOrThisOnly() {
        if (this.event && this.event.parentId) {
            this.alertCtrl.create({
                title: this.utils.translateWord('saving'),
                message: this.utils.translateWord('multiSaveMessage'),
                buttons: [
                  {
                    text: this.utils.translateWord('editAllButton'),
                    handler: data => {
                      this.saveEvent();
                    }
                  },
                  {
                    text: this.utils.translateWord('editOneButton'),
                    handler: data => {
                      this.event.parentId = null;
                      this.saveEvent();
                    }
                  },
                  {
                    text: this.utils.translateWord('cancel'),
                    role: 'cancel'
                  },
                ]
              }).present();
        } else {
            this.saveEvent();
        }
    }

    saveEvent() {
        if (!this.title) {
            this.utils.showError(this.alertCtrl, "errorTitle", "errorNoTitle");
            return;
        }

        var eventStartTime = this.eventDate.split("T")[0] + ' ' + this.startTime.split("T")[1].split(".")[0].split("Z")[0];
        var eventEndTime = this.eventDate.split("T")[0] + ' ' + this.endTime.split("T")[1].split(".")[0].split("Z")[0];

        if (this.utils.getDiff(eventStartTime, eventEndTime) < 0) {
            this.utils.showError(this.alertCtrl, "errorTitle", "errorDateSelectionInvalid");
            return;
        }

        if (this.event && this.event.activityStartTime){
            this.utils.showError(this.alertCtrl, "errorTitle", "errorActivityInProgress");
            return;
        }

        var eventToSave = {
            startTime: eventStartTime,
            endTime: eventEndTime,
            category: this.activityType,
            title: this.title,
            passedTime: null,
            summary: this.description,
            location: this.location
        };

        const repetition = parseInt(this.repetition);

        let loading = this.loadingCtrl.create({
            content: this.utils.translateWord("loading")
        });

        loading.present();
        
        if (this.event) {
            eventToSave['id'] = this.event.id;
            eventToSave['userId'] = this.event.userId;
            eventToSave['originalStartTime'] = this.originalStartTime;
            eventToSave['parentId'] = this.event.parentId;
            eventToSave.passedTime = this.event.passedTime;
            this.eventService.edit(eventToSave).then(data => {
                loading.dismiss();
                this.navCtrl.pop();
            }, data => {
                loading.dismiss();
                this.utils.showError(this.alertCtrl, "errorTitle", data.error);
                this.navCtrl.pop();
            });
        } else {
            this.eventService.add(eventToSave, repetition).then(data => {
                loading.dismiss();
                this.navCtrl.pop();
            }, data => {
                loading.dismiss();
                this.utils.showError(this.alertCtrl, "errorTitle", data.error);
                this.navCtrl.pop();
            });
        }
    }

    ionViewWillEnter() {
        this.tabBarElement.style.display = 'none';
    }

    ionViewWillLeave() {
        this.tabBarElement.style.display = 'flex';
    }
}