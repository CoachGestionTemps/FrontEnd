import { Component} from '@angular/core';

import { SettingService } from '../../services/setting-service';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {
  selectedLanguage: any;
  isInSSP: any;


  constructor(private settingService : SettingService) {
    this.selectedLanguage = settingService.getLanguage();
    this.isInSSP = settingService.isSSP();
  }

  setLanguage(lang: string) {
    //ToDo: Find a way to not refresh to change the language :
    this.settingService.setLanguage(lang);
    location.reload();
  }

  updateSSPKey(){
    this.settingService.setIsSSP(this.isInSSP);
  }

  disconnect() {

  }
}
