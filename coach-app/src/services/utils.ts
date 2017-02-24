import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable()
export class Utils {
  moment: any;

  constructor() {
      this.moment = moment;
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
    var categories = ['undefined', 'class', 'study', 'sport', 'leisure', 'work'];
    return 'category-' + categories[category];
  }
}
