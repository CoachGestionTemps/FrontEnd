import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable, BehaviorSubject} from "rxjs";
import moment from 'moment';

@Injectable()
export class EventService {
  url = ''; // THIS WILL BE OUR API ENDPOINT
  storageKey = "events";
  events = JSON.parse(localStorage.getItem(this.storageKey)) || [];
  moment: any;
  nextKey: any;

  constructor(private http: Http) {
      this.moment = moment;
      this.nextKey = 8;
  }

  public getAll(): Promise<any[]> {
      // TODO : Replace this with an http.get method
    return new Promise(
        (resolve, reject) => {
            if (this.events.length === 0){
                // TODO : Replace this with an http.get method
                this.events = [
                {
                    id: 0,
                    start_datetime: moment().format(),
                    end_datetime: moment().hour(moment().hour() + 2).format(),
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
                    start_datetime: moment().date(moment().date() + 1).format(),
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
                    start_datetime: moment().hour(moment().hour() + 2).format(),
                    end_datetime: moment().hour(moment().hour() + 4).format(),
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
                    start_datetime: moment().hour(moment().hour() + 4).format(),
                    end_datetime: moment().hour(moment().hour() + 6).format(),
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
                    start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
                    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
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
                    start_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 2).format(),
                    end_datetime: moment().date(moment().date() + 7).hour(moment().hour() + 4).format(),
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
                    start_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 3).format(),
                    end_datetime: moment().date(moment().date() + 1).hour(moment().hour() + 7).format(),
                    category: 5,
                    user_id: 2,
                    title: "Shift Subway",
                    passed_time: null,
                    summary: null,
                    location: "3065 Rue King O, Sherbrooke, QC J1L 1C8",
                    parent_id: 7
                },
                ];
                this.updateCache();
            }
            resolve(this.events)
        }
    );
  }

   getEventsForDays(days): Promise<any[]> {
      return new Promise(
        (resolve, reject) => {
            this.getAll().then(events => {
                var isSameDay = (d, e) => d.isSame(this.moment(e.start_datetime), 'day');
                resolve(days.map(d => { return { day: d, events : events.filter(e => isSameDay(d, e)) }; }))
            });
        }
    );
  }

  add(event) {
    event[ 'id' ] = this.nextKey;
    event[ 'parent_id' ] = this.nextKey;
    this.events.push(event);
    this.updateCache();
    ++this.nextKey;
  }

  modify(event)
  {
    for (var i in this.events) {
      if (this.events[i].id == event.id) {
        this.events[i] = event;
        break;
      }
    }
  }

  private updateCache(){
      localStorage.setItem(this.storageKey, JSON.stringify(this.events));
  }
}
