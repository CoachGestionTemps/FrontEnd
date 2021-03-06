import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, RequestOptionsArgs} from "@angular/http";
import {Observable, BehaviorSubject} from "rxjs";
import { SettingService } from '../services/setting-service';
import { Utils } from '../services/utils';
import { Const } from '../services/const';
import { Events } from 'ionic-angular';
import moment from 'moment';

@Injectable()
export class EventService {
  url: string;
  storageKey: string;
  moment: any;
  loadFromServer: boolean;

  constructor(private http: Http, private setting: SettingService, private events : Events, private utils : Utils, private cnst : Const) {
      this.url = setting.getEndPointURL();
      this.storageKey = this.cnst.dayKeysStorageKey;
      this.moment = moment;
      var lastUpdate = setting.getLastUpdate();

      // if we never updated or if it's been more than 15 minutes since the last update
      // if no events are present for today, we force load in case the initial load didn't work
      this.loadFromServer = !lastUpdate || this.utils.getDiffFromNow(lastUpdate) > 900 || !this.getDayKeys().some(x => x === moment().format(this.cnst.dateKeyFormat));
  }

  public syncCourses() : void {
      window.location.replace('https://cas.usherbrooke.ca/login?service=' + encodeURIComponent(this.setting.getEndPointURL() + '/synccourses?redirect=' + window.location.href));
  }

  public reloadFromServer(){
      this.loadFromServer = true;
  }

    public getEventsForDays(days): Promise<any[]> {
        var getDays = () => {
            return days.map(d => {
                return {
                    day: d,
                    events: this.sortEvents(JSON.parse(localStorage.getItem(this.getDayKey(d))) || [])
                }
            });
        };

        return this.getFromServerOrCache(getDays);
    }

    private sortEvents(events: any[]) : any[] {
        return events.sort((b, a) => { return this.utils.getDiff(a.startTime, b.startTime); });
    }

    public getEventsForDateRange(minDate, maxDate): Promise<any[]> {
        var getEvents = () => {
            var iter = this.moment(minDate);
            var days = [];
            while(iter.isBefore(maxDate)){
                days.push(iter.format(this.cnst.dateKeyFormat));
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

    public refreshEvent(event): any {
      var refreshedEvent = localStorage.getItem(this.getEventKey(event))
      if(refreshedEvent) {
        var events = JSON.parse(refreshedEvent).filter(e => { return e.id == event.id; });
        return events && events.length > 0 ? events[0] : null;
      }
    }

    public add(event, repetition = 0) : Promise<any> {
        event.id = this.guid();
        event.userId = this.setting.getCIP();

        var events = [];

        if (repetition > 0) {
            event.parentId = event.id;

            var startTime = this.moment(event.startTime, this.cnst.dateFormat);
            var endTime = this.moment(event.endTime, this.cnst.dateFormat);

            for (var i = 1; i <= repetition; i++) {
                startTime = startTime.add(7, "days");
                endTime = endTime.add(7, "days");

                var nextEvent = JSON.parse(JSON.stringify(event));
                nextEvent.id = this.guid();
                nextEvent.startTime = startTime.format(this.cnst.dateFormat);
                nextEvent.endTime = endTime.format(this.cnst.dateFormat);

                events.push(nextEvent);
            }
        }
        
        events.unshift(event);

        return new Promise(
            (resolve, reject) => {
                this.http.put(this.setting.getEndPointURL() + '/events', events, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == "succes"){
                        if (data.donnees && data.donnees.insertedEvents > 0){
                            events.forEach(e => this.addInCache(e));
                            this.events.publish(this.cnst.eventUpdate);
                        } else {
                            reject({ error: "errorWhileSaving"});
                        }
                        resolve(data);
                    } else {
                        reject({ statut: data.statut, error: "errorCantCreateEvent" })
                    }
                });
            }
        );
    }

    public edit(event) : Promise<any> {
        var originalStartTime = event.originalStartTime;
        delete event.originalStartTime;

        return new Promise(
            (resolve, reject) => {
                this.http.post(this.setting.getEndPointURL() + '/events', event, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == this.cnst.successStatus){
                        if (data.donnees && data.donnees.updatedEvents > 0){
                            if (data.donnees.updatedEvents > 1) {
                                this.refreshEvents().then(d => this.events.publish(this.cnst.eventUpdate));
                            } else {
                                this.updateInCache(event, originalStartTime);
                                this.events.publish(this.cnst.eventUpdate);
                            }
                        } else {
                            reject({ error: "errorEventDoesntExistOrNoFieldsChanged"});
                        }
                        resolve(data);
                    } else {
                        reject({ statut: data.statut })
                    }
                });
            }
        );
    }

    public editTime(event) : Promise<any> {
        var data = {
            id: event.id,
            passedTime: event.passedTime,
            activityStartTime: event.activityStartTime
        };

        return new Promise(
            (resolve, reject) => {
                this.http.post(this.setting.getEndPointURL() + '/events', data, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == this.cnst.successStatus){
                        if (data.donnees && data.donnees.updatedEvents > 0){
                            this.updateInCache(event, null);
                            this.events.publish(this.cnst.eventUpdate);
                        } else {
                            reject({ error: "errorEventDoesntExistOrNoFieldsChanged"});
                        }
                        resolve(data);
                    } else {
                        reject({ statut: data.statut })
                    }
                });
            }
        );
    }


    public delete(event, deleteAllRepeatedEvents = false) : Promise<any> {
        const parameter = deleteAllRepeatedEvents ? event.parentId + '?isDelAll=true' : event.id;

        return new Promise(
            (resolve, reject) => {
                this.http.delete(this.setting.getEndPointURL() + '/events/' + parameter, this.getOptions()).map((response) => {
                    return response.json()
                }).toPromise().then(data => {
                    if (data.statut == this.cnst.successStatus){
                        if (data.donnees && data.donnees.deletedEvents > 0){
                            if (data.donnees.deletedEvents > 1) {
                                this.refreshEvents().then(d => this.events.publish(this.cnst.eventUpdate));
                            } else {
                                this.removeFromCache(event);
                                this.events.publish(this.cnst.eventUpdate);
                            }
                        } else {
                            reject({ error: "errorEventAlreadyDeleted"});
                        }
                        resolve(data);
                    }
                    reject({ statut: data.statut })
                });
            }
        );
    }

    private updateEventPassedTime(event) : Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.http.post(this.setting.getEndPointURL() + '/events', event, this.getOptions()).map((response) => {
                    return response.json();
                }).toPromise().then(data => {
                    if (data.statut == this.cnst.successStatus){
                        resolve(data);
                    } else {
                        reject({ statut: data.statut })
                    }
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

    private refreshEvents() : Promise<any> {
        return new Promise(
            (resolve, reject) => {
                this.http.get(this.setting.getEndPointURL() + '/events/' + this.setting.getCIP(), this.getOptions()).map((response) => {
                    return response.json()
                }).toPromise().then(data => {
                    this.loadFromServer = false;
                    this.setting.setLastUpdate();
                    if (data.statut == this.cnst.successStatus){
                        this.overwriteCache(data.donnees);
                        resolve();
                    } else {
                        reject({ error: "errorNotAuthentifiedOrInvalidCIP" });
                    }
                }).catch(data => {
                    reject({ error: "errorServerIsDown"});
                });
            }
        );
    }

    private overwriteCache(events): void {
        this.getDayKeys().forEach(key => {
            localStorage.removeItem(key);
        });

        var keys = [];
        var days = {};

        events.forEach(e => {
            if (this.utils.adjustEventPassedTime(e)){
                // TODO : we should validate this if an error occurs (rollback?)
                this.updateEventPassedTime(e);
            }

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
        return day.format(this.cnst.dateKeyFormat);
    }

    private guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}
