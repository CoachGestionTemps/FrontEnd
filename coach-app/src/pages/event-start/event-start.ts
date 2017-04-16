import { Component } from '@angular/core';
import { NavParams, NavController, Events, AlertController } from 'ionic-angular';
import { EventService } from '../../services/event-service';
import { Utils } from '../../services/utils';
import { Const } from '../../services/const';
import { Observable, Subject } from 'rxjs/Rx';
import moment from 'moment';

@Component({
    selector: 'page-event-start',
    templateUrl: 'event-start.html'
})

export class EventStartPage {
    pauser: Subject<{}>;
    passedTime: number;
    playing: boolean;
    pausable: any;
    timer: any;
    event: any;
    moment: any;
    tabBarElement: any;
    canPressButton: boolean;
    waitBeforePress: number;

    constructor(public navCtrl: NavController, navParams: NavParams, private events: Events,
                private eventService: EventService, private utils: Utils, private cnst: Const,
                private alertCtrl : AlertController) {
        this.moment = moment;
        this.event = navParams.get("event");
        this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
        this.playing = true;
        this.canPressButton = true;
        this.waitBeforePress = 5000;

        // if the activity was started, not paused and we came back without refreshing the data from server
        this.passedTime = this.utils.getPassedTimeFromActivityStart(this.event);

        this.pauser = new Subject();
        this.timer = Observable.timer(0, 1000);
        this.pausable = this.pauser.switchMap(paused => paused ? Observable.never() : this.timer);
        this.pausable.subscribe(() => this.passedTime++);
        this.play();
    }

    play() {
        if (this.canPressButton) {
            if (this.event.activityStartTime) {
                this.pauser.next(false);
                this.playing = true;
            } else {
                this.canPressButton = false;
                this.event.activityStartTime = this.moment().format(this.cnst.dateFormat);
                this.eventService.edit(this.event).then(data => {
                    this.pauser.next(false);
                    this.playing = true;
                    var self = this;
                    setTimeout(function() {
                        self.canPressButton = true;
                    }, this.waitBeforePress);
                }, data => {
                this.utils.showError(this.alertCtrl, "errorTitle", "errorCantPlayEvent");
                });
            }
        }
    }

    pause() {
        if (this.canPressButton){
            this.canPressButton = false;
            this.utils.adjustEventPassedTimeOnPause(this.event)
            this.eventService.edit(this.event).then(data => {
                this.pauser.next(true);
                this.playing = false;
                var self = this;
                setTimeout(function() {
                    self.canPressButton = true;
                }, this.waitBeforePress);
            }, data => {
                this.utils.showError(this.alertCtrl, "errorTitle", "errorCantPauseEvent");
            });
        }   
    }

    playPauseToggle() {
        this.playing ? this.pause() : this.play();
    }

    ionViewWillEnter() {
        this.tabBarElement.style.display = 'none';
    }

    ionViewWillLeave() {
        this.tabBarElement.style.display = 'flex';
    }
}