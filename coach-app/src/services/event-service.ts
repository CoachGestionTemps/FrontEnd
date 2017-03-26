import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, RequestOptionsArgs} from "@angular/http";
import {Observable, BehaviorSubject} from "rxjs";
import { SettingService } from '../services/setting-service';
import { Utils } from '../services/utils';
import { Events } from 'ionic-angular';
import moment from 'moment';

@Injectable()
export class EventService {
  url: string;
  storageKey: string;
  moment: any;
  loadFromServer: boolean;

  constructor(private http: Http, private setting: SettingService, private events : Events, private utils : Utils) {
      this.url = setting.getEndPointURL();
      this.storageKey = "keys";
      this.moment = moment;
      this.loadFromServer = true;
  }

  public reloadFromServer(){
      this.loadFromServer = true;
  }

    public refreshEvents() : Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.http.get(this.setting.getEndPointURL() + '/events/' + this.setting.getCIP(), this.getOptions()).map((response) => {
                    return response.json()
                }).toPromise().then(data => {
                    this.loadFromServer = false;
                    if (data.statut == "succes"){
                        this.overwriteCache(data.donnees);
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(data => {
                    reject();
                });
            }
        );
    }

    public getEventsForDays(days): Promise<any[]> { 
        var getDays = () => {
            return days.map(d => { 
                return { 
                    day: d,
                    events: JSON.parse(localStorage.getItem(this.getDayKey(d))) || []
                }
            });
        };

        return this.getFromServerOrCache(getDays);
    }

    public getEventsForDateRange(minDate, maxDate): Promise<any[]> {
        var getEvents = () => {
            var iter = this.moment(minDate);
            var days = [];
            while(iter.isBefore(maxDate)){
                days.push(iter.format(this.utils.dateKeyFormat));
                iter.add(1, 'day');
            }
            return this.getCachedEvents(days);
        };
        
        return this.getFromServerOrCache(getEvents);
    }

    public getDaysAndHasEvents(month): Promise<any> {
        var getDays = () => {
            var keys = this.getDayKeys();
            return month.map(week => { 
                return week.map(d => {
                    return { 
                        day: d,
                        hasEvents: keys.indexOf(this.getDayKey(d)) != -1
                    }; 
                });
            });
        };

        return this.getFromServerOrCache(getDays);
    }

    public add(event) : Promise<any> {
        event.id = this.guid();
        event.parentId = event.id;
        event.userId = this.setting.getCIP();

        return new Promise(
            (resolve, reject) => {
                this.http.put(this.setting.getEndPointURL() + '/events', event, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == "succes"){
                        this.addInCache(event);
                        this.events.publish('event:update');
                        resolve(data);
                    }
                    reject({ statut: data.statut })
                });
            }
        );
    }

    public edit(event) : Promise<any> {
        var activityStartTime = event.activityStartTime;
        var originalStartTime = event.originalStartTime;
        delete event.activityStartTime;
        delete event.originalStartTime;

        return new Promise(
            (resolve, reject) => {
                this.http.post(this.setting.getEndPointURL() + '/events', event, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == "succes"){
                        this.updateInCache(event, originalStartTime);
                        this.events.publish('event:update');
                        resolve(data);
                    } else {
                        reject({ statut: data.statut })
                    }
                });
            }
        );
    }

    public delete(event) : Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.http.delete(this.setting.getEndPointURL() + '/events/' + event.id, this.getOptions()).map((response) => {
                    return response.json()
                }).toPromise().then(data => {
                    if (data.statut == "succes"){
                        this.removeFromCache(event);
                        this.events.publish('event:update');
                        resolve(data);
                    }
                    reject({ statut: data.statut })
                });
            }
        );
    }

    private getFromServerOrCache(func): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.loadFromServer) {
                this.refreshEvents().then(() => {
                    resolve(func());
                }).catch(data => {
                    reject(data);
                });
            } else {
                resolve(func());
            }
        });
    }

    private overwriteCache(events): void {
        this.getDayKeys().forEach(key => {
            localStorage.removeItem(key);
        });

        var keys = [];
        var days = {};

        events.forEach(e => {
            var key = this.getEventKey(e);
            if (keys.indexOf(key) != -1){
                days[key].push(e);
            } else {
                days[key] = [e];
                keys.push(key);
            }
        });

        localStorage.setItem(this.storageKey, JSON.stringify(keys));

        keys.forEach(key => {
            localStorage.setItem(key, JSON.stringify(days[key]));
        });
    }

    private removeFromCache(event): void {
        var keys = this.getDayKeys();
        var key = this.getEventKey(event);
        var indexOfKey = keys.indexOf(key);

        if (indexOfKey != -1){
            var dayEvents = JSON.parse(localStorage.getItem(key));
            if (dayEvents){
                dayEvents = dayEvents.filter(e => { return e.id != event.id; });
                if (dayEvents.length > 0){
                    localStorage.setItem(key, JSON.stringify(dayEvents));
                } else {
                    keys.splice(indexOfKey, 1);
                    localStorage.setItem(this.storageKey, JSON.stringify(keys));
                    localStorage.removeItem(key);
                }
            }
        }
    }

    private updateInCache(event, originalStartTime): void {
        var clonedEvent = JSON.parse(JSON.stringify(event));
        if (originalStartTime){
            clonedEvent.startTime = originalStartTime;
        }
        this.removeFromCache(clonedEvent);
        this.addInCache(event);
    }

    private addInCache(event): void {
        var keys = this.getDayKeys();
        var key = this.getEventKey(event);
        var indexOfKey = keys.indexOf(key);
        if (indexOfKey == -1) {
            keys.push(key);
            localStorage.setItem(this.storageKey, JSON.stringify(keys));
            localStorage.setItem(key, JSON.stringify([event]));
        } else {
            var dayEvents = JSON.parse(localStorage.getItem(key));
            dayEvents.push(event);
            localStorage.setItem(key, JSON.stringify(dayEvents));
        }
    }

    private getAllCachedEvents(): any[] {
        return this.getCachedEvents(this.getDayKeys());
    }

    private getCachedEvents(keys): any[] {
        var events = [];
        keys.forEach(key => {
            events = events.concat(JSON.parse(localStorage.getItem(key)) || []);
        });
        return events;
    }

    private getOptions(): RequestOptions {
        var headers = new Headers({'Content-Type': 'application/json'});
        headers.append("token", this.setting.getEventToken());
        return new RequestOptions({headers: headers});
    }

    private getDayKeys(): string[] {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    private getEventKey(event): string {
        return event.startTime.split(' ')[0];
    }

    private getDayKey(day): string {
        return day.format(this.utils.dateKeyFormat);
    }

    private guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}
