import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams} from 'ionic-angular';
import firebase, { firestore } from 'firebase';
import { map } from 'rxjs/operator/map';
import {AngularFirestore} from 'angularfire2/firestore'
import { AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  userE = {} as User;
  userV = {} as User;
  public hobbies: any[] 
  public time: any[]
  public numOfMeeting: any[]
  posts :any

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
    this.userE = this.navParams.get('eldely');
    console.log(this.userE)
    this.userV = this.navParams.get('volunteer');
    console.log(this.userV)
  }
}
