import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }

}
