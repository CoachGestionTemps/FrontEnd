import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { TabsPage } from '../pages/tabs/tabs';
import { GuidService } from "../services/guid-service";
import { SettingService } from "../services/setting-service";


@Component({
  templateUrl: 'app.html',
  providers: [GuidService, SettingService]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, translate: TranslateService, private setting : SettingService) {
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
        //window.location.replace('https://cas.usherbrooke.ca/login?service=' + encodeURIComponent(setting.getEndPointURL() + '/auth/retourcas' + (setting.isProd() ? "" : "?isDev=true")));
      }

      StatusBar.styleDefault();
      Splashscreen.hide();

      translate.setDefaultLang(setting.getLanguage());
      translate.use(setting.getLanguage());
    });
  }
}
