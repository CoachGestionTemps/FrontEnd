import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable, BehaviorSubject} from "rxjs";

@Injectable()
export class EventService {
  url = ''; // THIS WILL BE OUR API ENDPOINT
  storageKey = "mySchedules";
  events = JSON.parse(localStorage.getItem(this.storageKey)) || [];

  constructor(private http: Http) {

  }

  public getAll() {
      // TODO : Replace this with an http.get method
    return new Promise(
        function(resolve, reject) {
            if (this.events == []){
                // TODO : Replace this with an http.get method
                this.events = [
                    {
                        
                    }
                ]
                localStorage.setItem(this.storageKey, JSON.stringify(this.events));
            }
            resolve(this.events)
        }
    );
  }
}
