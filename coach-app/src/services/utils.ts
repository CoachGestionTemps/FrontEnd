import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable()
export class Utils {
  moment: any;
  categories: any;
  categoryicons: any;

  constructor() {
      this.moment = moment;
      this.categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work'];
      this.categoryicons = ['list-box', 'school','book', 'basketball', 'game-controller-b', 'briefcase'];
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
}
