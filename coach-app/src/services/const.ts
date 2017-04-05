import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable()
export class Const {
    dateKeyFormat: string;
    dateFormat: string;
    utcDateFormat: string;
    dayKeysStorageKey: string;
    successStatus: string;
    eventUpdate: string;
    
    constructor(){
        this.dateKeyFormat = "YYYY-MM-DD";;
        this.dateFormat = "YYYY-MM-DD HH:mm:ss";
        this.utcDateFormat = "YYYY-MM-DD[T]HH:mm[:00.000Z]";
        this.dayKeysStorageKey = "keys";
        this.successStatus = "succes";
        this.eventUpdate = "event:update";
    }
}