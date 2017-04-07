import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SettingService } from '../../services/setting-service';
import { EventService } from '../../services/event-service';
import { WalkthroughPage } from '../../pages/walkthrough/walkthrough';

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})

export class SettingPage {
    selectedLanguage: string;
    isInSSP: boolean;

    constructor(private settingService: SettingService, private eventService : EventService, private modalCtrl : ModalController) {
        this.selectedLanguage = settingService.getLanguage();
        this.isInSSP = settingService.isSSP();
    }

    setLanguage() : void {
        if (this.settingService.getLanguage() != this.selectedLanguage){
            this.settingService.setLanguage(this.selectedLanguage);
            location.reload();
        }
    }

    updateSSPKey() : void {
        this.settingService.setIsSSP(this.isInSSP);
    }

    disconnect() : void {
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