import {Injectable} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import moment from 'moment';

@Injectable()
export class SettingService {
    langKey: string;
    isSSPSupportKey: string;
    cipKey: string;
    eventTokenKey: string;

    constructor(private translate: TranslateService) {
        this.langKey = 'lang';
        this.isSSPSupportKey = 'isSSPSupportKey';
        this.cipKey = 'cip';
        this.eventTokenKey = 'eventToken';
    }

    /* GETTERS */

    getLanguage(){
        return localStorage.getItem(this.langKey) || 'fr';
    }

    getMomentLanguage(){
        return this.getLanguage() + '-ca';
    }

    getCIP(){
        return localStorage.getItem(this.cipKey);
    }

    getEventToken(){
        return localStorage.getItem(this.eventTokenKey);
    }

    getEndPointURL(){
        // TODO : Add production back end URL
        return this.isProd() ? "" : "https://www.usherbrooke.ca/~desp2714/";
    }

    isProd(){
        return window.location.href.indexOf("localhost") === -1;
    }

    /* SETTERS */

    setLanguage(lang){
        this.validateAndSave(this.langKey, lang, this.validateLanguage);
    }

    setCIP(cip){
        this.validateAndSave(this.cipKey, cip, this.validateCIP);
    }

    setEventToken(token){
        this.validateAndSave(this.eventTokenKey, token, null);
    }

    /* PRIVATE METHODS */

    private validateLanguage(lang){
        return ['fr', 'en'].indexOf(lang) != -1;
    }

    private validateCIP(cip){
        return cip.length === 8 && /^\d+$/.test(cip);
    }

    private validateAndSave(key, data, validate){
        if (!validate || validate(data)){
            localStorage.setItem(key, data);
        }
    }
}
