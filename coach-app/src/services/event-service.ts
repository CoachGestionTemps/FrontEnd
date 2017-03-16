import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable, BehaviorSubject} from "rxjs";
import { SettingService } from '../services/setting-service';
import moment from 'moment';

@Injectable()
export class EventService {
  url: string;
  storageKey: string;
  events: any[];
  moment: any;

  constructor(private http: Http, private setting: SettingService) {
      this.url = setting.getEndPointURL();
      this.storageKey = "events";
      this.moment = moment;
  }

  refreshEvents() {
      this.getAll().then(events => {
          this.events = events;
          this.updateCache();
      });
  }

  public getAll(): Promise<any[]> {
    return new Promise(
        (resolve, reject) => {
            if (!this.events || this.events.length === 0){
                // TODO : Replace this with an http.get method
                this.http.get(this.setting.getEndPointURL() + '/events/1').map((response) => {
                    return response.json()
                }).toPromise().then(events => {
                    this.events = events;
                    this.updateCache();
                    resolve(this.events);
                });
            } else {
                resolve(this.events);
            }
        }
    );
}

getEventsForDays(days): Promise<any[]> {
    return new Promise(
        (resolve, reject) => {
            this.getAll().then(events => {
                var isSameDay = (d, e) => d.isSame(this.moment(e.start_time, "YYYY-MM-DD HH:mm:ss"), 'day');
                console.log(this.moment(events[0].start_time, "YYYY-MM-DD HH:mm:ss"));
                resolve(days.map(d => { return { day: d, events : events.filter(e => isSameDay(d, e)) }; }))
            });
        }
    );
  }

  add(event) {
    event.id = this.guid();
    event.parent_id = event.id;
    // TODO : PUT request, if success :
    this.events.push(event);
    this.updateCache();
    // else : error message
  }

  edit(event) {
    for (var i in this.events) {
      if (this.events[i].id == event.id) {
        // TODO : POST request, if success:
        this.events[i] = event;
        this.updateCache();
        // else : error message
        break;
      }
    }
  }

  delete(event){
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].id == event.id) {
        // TODO : DELETE request, if success :
        this.events.splice(i, 1);
        this.updateCache();
        // else : error message
        break;
      }
    }
  }

  private updateCache(){
      localStorage.setItem(this.storageKey, JSON.stringify(this.events));
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
