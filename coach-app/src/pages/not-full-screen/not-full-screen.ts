import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'page-not-full-screen',
    templateUrl: 'not-full-screen.html'
})

export class NotFullScreen {
    isIOS: boolean;
    constructor(private platform : Platform) {
        this.isIOS = platform.is('ios') || platform.is('ipad');
    }
}