import {Injectable} from '@angular/core';
import {TranslateService} from 'ng2-translate';
import moment from 'moment';

@Injectable()
export class SettingService {
    langKey: string;
    isSSPSupportKey: string;
    cipKey: string;
    eventTokenKey: string;
    isSSPKey: string;

    constructor(private translate: TranslateService) {
        this.langKey = 'lang';
        this.isSSPSupportKey = 'isSSPSupportKey';
        this.cipKey = 'cip';
        this.eventTokenKey = 'eventToken';
        this.isSSPKey = 'isSSP';
    }

    /* GETTERS */

    getLanguage() : string{
        return localStorage.getItem(this.langKey) || 'fr';
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

    isSSP() : boolean{
        return localStorage.getItem(this.eventTokenKey) == 'true';
    }

    isProd() : boolean{
        return (window.location.href.indexOf("localhost") === -1);
    }

    /* SETTERS */

    setLanguage(lang: string) : void{
        this.validateAndSave(this.langKey, lang, this.validateLanguage);
    }

    setCIP(cip: string) : void{
        this.validateAndSave(this.cipKey, cip, this.validateCIP);
    }

    setEventToken(token: string) : void{
        this.validateAndSave(this.eventTokenKey, token, null);
    }

    setIsSSP(isSSP: boolean) : void{
        this.validateAndSave(this.isSSPKey, isSSP.toString(), null);
    }

    logout() : void{
        localStorage.removeItem(this.cipKey);
    }

    /* PRIVATE METHODS */

    private validateLanguage(lang: string) : boolean{
        return ['fr', 'en'].indexOf(lang) != -1;
    }

    private validateCIP(cip: string) : boolean{
        return /^[a-z]{4}\d{4}$/.test(cip);
    }

    private validateAndSave(key, data, validate) : void{
        if (!validate || validate(data)){
            localStorage.setItem(key, data);
        }
    }
}
