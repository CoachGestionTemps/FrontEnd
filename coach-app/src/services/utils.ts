import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { SettingService } from "../services/setting-service";
import { Const } from "../services/const";
import moment from 'moment';

@Injectable()
export class Utils {
    moment: any;
    categories: string[];
    categoryicons: string[];
    categoryNames: string[];
    categoryColors: string[];
    errorTitle: string;

    constructor(private translate: TranslateService, private setting: SettingService, private cnst: Const) {
        this.moment = moment;
        this.categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work', 'createEvent'];
        this.categoryColors = ['#3d4641', '#237B9F', '#FF928B', '#FAA200', '#AECAD6', '#9D8DF0', '#007c52'];
        this.categoryicons = ['list-box', 'school', 'book', 'basketball', 'game-controller-b', 'briefcase'];
        this.translate.use(this.setting.getLanguage());
        this.errorTitle = this.translateWord('errorTitle');
        this.getCategoryNames();
    }

    getCategoryName(category): string {
        return this.categoryNames[category];
    }

    getCategoryColors(category): string {
        return this.categoryColors[category];
    }

    getCategories(): string[] {
        return this.categories;
    }

    generateHours(): number[] {
        var hours = [];
        for (var j = 1; j <= 24; j++) {
            hours.push(j % 24);
        }
        return hours;
    }

    displayHour(h): string {
        return ('0' + h).slice(-2) + ":00";
    }

    getCategoryClass(category: number): string {
        return 'category-' + this.categories[category];
    }

    getCategoryTranslationKey(category: number): string {
        return this.categories[category];
    }

    getIconName(category: number): string {
        return this.categoryicons[category];
    }

    translateWord(word: string): string {
        var wordTranslated;

        this.translate.get(word).subscribe((res: string) => {
            wordTranslated = res;
        });

        return wordTranslated;
    }

    // If an activity is going on, we're adding the live time 
    getPassedTimeFromActivityStart(event: any): number {
        if (event.activityStartTime) {
            var eventDuration = this.getDiff(event.startTime, event.endTime);
            var activityDuration = parseInt(event.passedTime || 0) + this.getDiffFromNow(event.activityStartTime);
            return Math.floor(eventDuration < activityDuration ? eventDuration : activityDuration);
        }
        return parseInt(event.passedTime || 0);
    }

    adjustEventPassedTime(event: any): boolean {
        if (event.activityStartTime) {
            var eventDuration = this.getDiff(event.startTime, event.endTime);
            var activityDuration = parseInt(event.passedTime || 0) + this.getDiffFromNow(event.activityStartTime);
            if (eventDuration < activityDuration) {
                event.passedTime = eventDuration;
                event.activityStartTime = null;
                return true;
            }
        }
        return false;
    }

    adjustEventPassedTimeOnPause(event: any): void {
        if (event.activityStartTime) {
            var eventDuration = this.getDiff(event.startTime, event.endTime);
            var activityDuration = parseInt(event.passedTime || 0) + this.getDiffFromNow(event.activityStartTime);
            event.passedTime = eventDuration < activityDuration ? eventDuration : activityDuration;
            event.activityStartTime = null;
        }
    }

    isEventConsideredDone(event: any): boolean {
        var activityDuration = parseInt(event.passedTime || 0) + (event.activityStartTime ? this.getDiffFromNow(event.activityStartTime) : 0);
        var eventDuration = this.getDiff(event.startTime, event.endTime);
        return activityDuration >= eventDuration;
    }

    showError(alertCrtl, title, content): void {
        let alert = alertCrtl.create({
            title: this.translateWord(title) ,
            subTitle: this.translateWord(content),
            buttons: ['OK']
        });
        alert.present();
    }

    getDiff(startDate: string, endDate: string): number {
        return Math.round(this.moment(endDate, this.cnst.dateFormat).diff(this.moment(startDate, this.cnst.dateFormat)) / 1000);
    }

    getDiffFromNow(startDate: string): number {
        return Math.round(this.moment().diff(this.moment(startDate, this.cnst.dateFormat)) / 1000);
    }

    getFormattedTime(ms: number): string {
        var duration = this.moment.duration(ms * 1000);
        var hours =  duration.asHours().length > 1 ? parseInt(duration.asHours()) : parseInt("0" + duration.asHours());
        return hours + ":" + ("0" + duration.minutes()).slice(-2)
    }

    private getCategoryNames() : void {
        this.categoryNames = [];
        this.categories.forEach((c) => {
            this.translate.get(c).subscribe((res: string) => {
                this.categoryNames.push(res);
            });
        });
    }
}