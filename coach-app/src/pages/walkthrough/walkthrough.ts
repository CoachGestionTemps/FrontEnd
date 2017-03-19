import { Component } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})

export class WalkthroughPage {
  constructor(public navCtrl: NavController, private viewCtrl : ViewController) {
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
