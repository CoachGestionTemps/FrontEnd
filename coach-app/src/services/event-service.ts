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

  public getAllTODO(): Promise<any[]> {
    return new Promise(
        (resolve, reject) => {
            if (!this.events || this.events.length === 0){
                // TODO : Replace this with an http.get method
                this.http.get(this.setting.getEndPointURL() + '/events/' + this.setting.getCIP()).map((response) => {
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

   public getAll(): Promise<any[]> {
      // TODO : Replace this with an http.get method
     return new Promise(
         (resolve, reject) => {
            this.events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            if (this.events.length === 0){
                 // TODO : Replace this with an http.get method
                this.events = [
                {
                    id: 0,
                    start_time: moment().format(),
                    end_time: moment().hour(moment().hour() + 2).format(),
                    category: 0,
                    user_id: 1,
                    title: "Fête de môman",
                    passed_time: null,
                    summary: "À chaque année, ma mère vieillit d'un année... Encore et encore!",
                    location: "123 ave DesMères, Ville Père, Q1W 2E3, Qc, Ca",
                    parent_id: 0
               },
                {
                    id: 2,
                    start_time: moment().date(moment().date() + 1).format(),
                    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 2).format(),
                    category: 2,
                    user_id: 1,
                    title: "Étude pour ADM111",
                    passed_time: null,
                    summary: "Pu capable de ce cours-là...",
                    location: "Chez nous...",
                    parent_id: 2
                },
                {
                    id: 3,
                    start_time: moment().hour(moment().hour() + 2).format(),
                    end_time: moment().hour(moment().hour() + 4).format(),
                    category: 1,
                    user_id: 1,
                    title: "ADM111",
                    passed_time: null,
                    summary: "Principe d'administration",
                    location: "K3-2021",
                    parent_id: 3
                },
                {
                    id: 4,
                    start_time: moment().hour(moment().hour() + 4).format(),
                    end_time: moment().hour(moment().hour() + 6).format(),
                    category: 3,
                    user_id: 1,
                    title: "Volley!",
                    passed_time: null,
                    summary: null,
                    location: "Centre Sportif",
                    parent_id: 4
                },
                {
                    id: 5,
                    start_time: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
                    end_time: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
                    category: 5,
                    user_id: 1,
                    title: "Shift McDo",
                    passed_time: null,
                    summary: null,
                    location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
                    parent_id: 5
                },
                {
                    id: 6,
                    start_time: moment().date(moment().date() + 7).hour(moment().hour() + 2).format(),
                    end_time: moment().date(moment().date() + 7).hour(moment().hour() + 4).format(),
                    category: 1,
                    user_id: 1,
                    title: "ADM111",
                    passed_time: null,
                    summary: "Principe d'administration",
                    location: "K3-2021",
                    parent_id: 3
                },
                {
                    id: 7,
                    start_time: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
                    end_time: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
                    category: 5,
                    user_id: 2,
                    title: "Shift Subway",
                    passed_time: null,
                    summary: null,
                    location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
                    parent_id: 7
                },
                ];
                resolve(this.events);
             }
            resolve(this.events)
         });
  }

getEventsForDays(days): Promise<any[]> {
    return new Promise(
        (resolve, reject) => {
            this.getAll().then(events => {
                var isSameDay = (d, e) => d.isSame(this.moment(e.start_time, "YYYY-MM-DD[T]HH:mm[:00.000Z]"), 'day');
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
