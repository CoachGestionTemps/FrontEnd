import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { TabsPage } from '../pages/tabs/tabs';
import { NotFullScreen } from '../pages/not-full-screen/not-full-screen';
import { SettingService } from "../services/setting-service";
import { EventService } from "../services/event-service";
import { Const } from "../services/const";
import { Utils } from "../services/utils";
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';


@Component({
  templateUrl: 'app.html',
  providers: [Const, SettingService, EventService, Utils]
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, translate: TranslateService, private setting : SettingService, public modalCtrl: ModalController, private eventService : EventService) {
    var loadApp = (!platform.is('ios') && !platform.is('android') && !platform.is('ipad')) || window.matchMedia('(display-mode: standalone)').matches || window.navigator['standalone'];
    this.rootPage = loadApp ? TabsPage : NotFullScreen;

    if (loadApp){
      if (window.location.search){
          window.location.search.replace('?', '').split('&').forEach(param => {
              var keyValue = param.split("=");
              if (keyValue.length === 2) {
                  if (keyValue[0].toLowerCase() === "cip") {
                      this.setting.setCIP(keyValue[1]);
                  } else if (keyValue[0].toLowerCase() === "token") {
                      this.setting.setEventToken(keyValue[1]);
                  }
              }
          });
          
          if (localStorage.getItem('firstLoad') !== "true") {
            localStorage.setItem('firstLoad', "true")
            window.location.reload();
          }

          if(window.history != undefined && window.history.pushState != undefined) {
              window.history.pushState({}, document.title, window.location.pathname);
          }
      } else if (!setting.getCIP() || !setting.getEventToken()){
        this.eventService.syncCourses();
      }
      
        platform.ready().then(() => {
        if (setting.isFirstUse()){
          this.modalCtrl.create(WalkthroughPage, {}, { enableBackdropDismiss: false }).present();
        }

        StatusBar.styleDefault();
        Splashscreen.hide();

        translate.setDefaultLang(setting.getLanguage());
        translate.use(setting.getLanguage());
      });
    }
  }
}