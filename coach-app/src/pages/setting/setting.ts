import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SettingService } from '../../services/setting-service';
import { EventService } from '../../services/event-service';
import { WalkthroughPage } from '../../pages/walkthrough/walkthrough';
import { Const } from '../../services/const';
import moment from 'moment';

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})

export class SettingPage {
    selectedLanguage: string;
    isInSPO: boolean;
    startOfDay: string;
    moment: any;

    constructor(private settingService: SettingService, private eventService : EventService, private modalCtrl : ModalController,
                private cnst : Const) {
        this.selectedLanguage = settingService.getLanguage();
        this.moment = moment;
        this.startOfDay = "2017-01-01T" + this.settingService.getStartOfDay() + ":00.000Z";
        this.isInSPO = settingService.isSPO();
    }

    setLanguage() : void {
        if (this.settingService.getLanguage() != this.selectedLanguage){
            this.settingService.setLanguage(this.selectedLanguage);
            location.reload();
        }
    }

    startOfDayChanged() : void {
        var times = this.startOfDay.split('T')[1].split(':');
        this.settingService.setStartOfDay(times[0] + ":" + times[1]);
    }

    updateSPOKey() : void {
        this.settingService.setIsSPO(this.isInSPO);
    }

    disconnect() : void {
        // TODO : logout CAS
        this.settingService.logout();
        location.reload();
    }

    syncCourses() : void {
        this.eventService.syncCourses();
    }

    showTutorial() : void {
        this.modalCtrl.create(WalkthroughPage, {}, { enableBackdropDismiss: false }).present();
    }
}