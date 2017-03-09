import {Injectable} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import moment from 'moment';

@Injectable()
export class Utils {
    moment: any;
    categories: string[];
    categoryicons: string[];
    categoryNames: string[];
    categoryColors: string[];

    constructor(private translate: TranslateService) {
        this.moment = moment;
        this.categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work'];
        this.categoryColors = ['#3d4641', '#387ef5', '#2d9d5f', '#E6A82A', '#f53d3d', '#4849A4'];
        this.categoryicons = ['list-box', 'school','book', 'basketball', 'game-controller-b', 'briefcase'];
        this.translate.use('fr');
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
      this._getCategoryName(this.categories.slice(0));
    }

    private _getCategoryName(categories){
      if (categories.length === 0){
        return;
      }

      this.translate.get(categories[0]).subscribe((res: string) => {
        categories.splice(0, 1); 
        this.categoryNames.push(res);
        this._getCategoryName(categories);
    });
  }
}
