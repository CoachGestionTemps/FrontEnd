import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {TranslateService} from 'ng2-translate';
import { TabsPage } from '../pages/tabs/tabs';
import {GuidService} from "../services/guid-service";


@Component({
  templateUrl: 'app.html',
  providers: [GuidService]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, translate: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // TODO : Load from settings (either en or fr)
      translate.setDefaultLang('fr');
      translate.use('fr');
    });
  }
}
