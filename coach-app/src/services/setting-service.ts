import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import {Http, RequestOptions, Headers, RequestOptionsArgs} from "@angular/http";
import { Const } from '../services/const';
import moment from 'moment';

@Injectable()
export class SettingService {
    langKey: string;
    isSPOSupportKey: string;
    cipKey: string;
    eventTokenKey: string;
    isSPOKey: string;
    isFirstUseKey: string;
    lastUpdateKey: string;
    startOfDayKey: string;
    moment: any;

    constructor(private translate: TranslateService, private http: Http, public cnst : Const) {
        this.langKey = 'lang';
        this.isSPOSupportKey = 'isSPOSupportKey';
        this.cipKey = 'cip';
        this.eventTokenKey = 'eventToken';
        this.isSPOKey = 'isSPO';
        this.isFirstUseKey = 'isFirstUse';
        this.lastUpdateKey = 'lastUpdate';
        this.startOfDayKey = 'startOfDay';
        this.moment = moment;
    }

    /* GETTERS */

    getLanguage() : string{
        return localStorage.getItem(this.langKey) || ((navigator.language || navigator['userLanguage']).indexOf('fr') == -1 ? 'en' : 'fr');
    }

    getMomentLanguage() : string{
        return this.getLanguage() + '-ca';
    }

    getCIP() : string{
        return localStorage.getItem(this.cipKey);
    }

    getEventToken() : string{
        return localStorage.getItem(this.eventTokenKey);
    }

    getEndPointURL() : string{
        // TODO : Add production back end URL
        return this.isProd() ? "https://www.usherbrooke.ca/~desp2714/app-start" : "https://www.usherbrooke.ca/~desp2714/app-start";
    }

    isSPO() : boolean{
        return localStorage.getItem(this.isSPOKey) == 'true';
    }

    isProd() : boolean{
        return (window.location.href.indexOf("localhost") === -1);
    }

    isFirstUse() : boolean {
        return localStorage.getItem(this.isFirstUseKey) == null;
    }

    getLastUpdate() : string {
        return localStorage.getItem(this.lastUpdateKey);
    }

    getStartOfDay() : string {
        return localStorage.getItem(this.startOfDayKey) || "08:00";
    }

    /* SETTERS */

    setLanguage(lang: string) : void {
        this.validateAndSave(this.langKey, lang, this.validateLanguage);
    }

    setCIP(cip: string) : void {
        this.validateAndSave(this.cipKey, cip, this.validateCIP);
    }

    setEventToken(token: string) : void {
        this.validateAndSave(this.eventTokenKey, token, null);
    }

    setIsSPO(isSPO: boolean) : void {
        this.validateAndSave(this.isSPOKey, isSPO.toString(), null);
    }

    logout() : Promise<any> {
        localStorage.removeItem(this.lastUpdateKey);
        localStorage.removeItem(this.cipKey);
        return new Promise((resolve, reject) => {
            this.http.get('https://cas.usherbrooke.ca/logout').toPromise().then(data => {
                resolve();
            });
        });
    }

    setNotFirstUse() : void {
        localStorage.setItem(this.isFirstUseKey, 'false');
    }

    setLastUpdate() : void {
        this.validateAndSave(this.lastUpdateKey, this.moment().format(this.cnst.dateFormat), null);
    }

    setStartOfDay(startOfDay : string) : void {
        this.validateAndSave(this.startOfDayKey, startOfDay, this.validateHour);
    }

    /* PRIVATE METHODS */

    private validateLanguage(lang: string) : boolean{
        return ['fr', 'en'].indexOf(lang) != -1;
    }

    private validateCIP(cip: string) : boolean{
        return /^[a-z]{4}\d{4}$/.test(cip);
    }

    private validateHour(hour: string) : boolean {
        return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(hour);
    }

    private validateAndSave(key, data, validate) : void{
        if (!validate || validate(data)){
            localStorage.setItem(key, data);
        }
    }
}
