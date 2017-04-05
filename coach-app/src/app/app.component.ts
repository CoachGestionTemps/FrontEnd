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
    this.rootPage = (!platform.is('ios') && !platform.is('android') && !platform.is('ipad')) || window.matchMedia('(display-mode: standalone)').matches || window.navigator['standalone'] ? TabsPage : NotFullScreen;

    platform.ready().then(() => {
      // Where we catch and store the CIP/Token
      if (window.location.search){
          var self = this;
          window.location.search.replace('?', '').split('&').forEach(param => {
              var keyValue = param.split("=");
              if (keyValue.length === 2){
                  if (keyValue[0].toLowerCase() === "cip"){
                      self.setting.setCIP(keyValue[1]);
                  } else if (keyValue[0].toLowerCase() === "token"){
                      self.setting.setEventToken(keyValue[1]);
                  }
              }
          });
          window.location.search = "";
      }

      // TODO : Uncomment when the Auth is done server side
      if (!setting.getCIP() || !setting.getEventToken()){
        //this.eventService.syncCourses();
      }

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