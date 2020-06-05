import { Component } from '@angular/core';
import { contactMessage } from '../../module/contactMessage';
import firebase from 'firebase';
import { NavController,NavParams} from 'ionic-angular';
import { HomePage } from '../home/home';
import { User } from '../../module/User';
import {AlertProvider} from '../../providers/alert/alert';


@Component({
  selector: 'contact-page',
  templateUrl: 'contactPage.html' ,
})

export class contactPage
 {
  contactMessage = {} as contactMessage;
  user = {} as User
  public dateTime: any
  

  constructor(public alert: AlertProvider ,public navCtrl: NavController , public params: NavParams)
  {
    this.user.loggedIn = this.params.get('login');
  }

  

  check_valid_fields()
  {
    if(this.contactMessage.fullName === undefined || this.contactMessage.phoneNumber === undefined
       || this.contactMessage.message === undefined)
       this.alert.showErrorMsg();
    else
      this.add_data_to_firebase()
  }



  add_data_to_firebase()
  {
    var date = new Date().toISOString().substring(0, 10);
    this.dateTime = date[8] + date[9] + "-" + date[5] + date[6] + "-" + date[0] + date[1]+ date[2] + date[3];
    
    const db = firebase.firestore();
    db.collection('message').doc().set(
      {
        fullName: this.contactMessage.fullName,
        phoneNumber: this.contactMessage.phoneNumber,
        message: this.contactMessage.message,
        dateTime: this.dateTime
      
      })
      .then(() => {
        this.alert.showAlert_sendMessage()
        this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn })
      }).catch((error)=> {
        console.log })
  }



  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn })
  }
  
}
