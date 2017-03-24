import {Injectable} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import { SettingService } from "../services/setting-service";
import moment from 'moment';

@Injectable()
export class Utils {
    moment: any;
    categories: string[];
    categoryicons: string[];
    categoryNames: string[];
    categoryColors: string[];
    dateKeyFormat: string;
    dateFormat: string;
    utcDateFormat: string;

      constructor(private translate: TranslateService, private setting: SettingService) {
        this.moment = moment;
        this.dateKeyFormat = "YYYY-MM-DD";
        this.dateFormat = "YYYY-MM-DD HH:mm:ss";
        this.utcDateFormat = "YYYY-MM-DD[T]HH:mm[:00.000Z]";
        this.categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work', 'createEvent'];
        this.categoryColors = ['#3d4641', '#237B9F', '#FF928B', '#FAA200', '#AECAD6', '#9D8DF0', '#007c52'];
        this.categoryicons = ['list-box', 'school','book', 'basketball', 'game-controller-b', 'briefcase'];
        this.translate.use(this.setting.getLanguage());
        this._getCategoryNames();
    }

    getCategoryName(category) {
      return this.categoryNames[category];
    }

    getCategoryColors(category) {
      return this.categoryColors[category];
    }

    generateHours() {
      var hours = [];
      for (var j = 1; j <= 24; j++){
        hours.push(j % 24);
      }
      return hours;
    }

    displayHour(h){
      return ('0' + h).slice(-2) + ":00";
    }

    getCategoryClass(category){
      return 'category-' + this.categories[category];
    }

    getCategoryTranslationKey(category){
      return this.categories[category];
    }

    getIconName(category){
      return this.categoryicons[category];
    }

    private _getCategoryNames(){
      this.categoryNames = [];
      this.categories.forEach((c) => {
          this.translate.get(c).subscribe((res: string) => {
            this.categoryNames.push(res);
          });
      });
    }

    translateWord(word){
      var wordTranslated;

      this.translate.get(word).subscribe((res: string) => {
        wordTranslated = res;
      });

      return wordTranslated;
    }

    showError(alertCrtl, title, content){
      let alert = alertCrtl.create({
        title: this.translateWord(title),
        subTitle: this.translateWord(content),
        buttons: ['OK']
      });
      alert.present();
    }
}
