import { Component } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { SettingService } from '../../services/setting-service';
import { Const } from '../../services/const';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
  providers: [SettingService, Const]
})

export class WalkthroughPage {
  selectedLanguage: string;
  constructor(public navCtrl: NavController, private viewCtrl : ViewController, private settingService : SettingService) {
      this.selectedLanguage = this.settingService.getLanguage();
  }
  
  dismiss() {
      this.settingService.setNotFirstUse();
      this.viewCtrl.dismiss();
  }

  setLanguage() : void {
      if (this.selectedLanguage != this.settingService.getLanguage()){
          this.settingService.setLanguage(this.selectedLanguage);
          location.reload();
      }
  }
}
