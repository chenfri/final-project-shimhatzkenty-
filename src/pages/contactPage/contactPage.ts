import { Component } from '@angular/core';
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
  msg = {} as User;
  user = {} as User
  public dateTime: any
  

  constructor(public alert: AlertProvider ,public navCtrl: NavController , public params: NavParams)
  {
    this.user.loggedIn = this.params.get('login');
  }


  validateCellPhoneNumber(phone)
  {
    var phoneRe =  /^\(?(05[0-9]{1})\)?([0-9]{3})?([0-9]{4})$/;
    var digits = phone.replace(/[-.]/g, "");
    return phoneRe.test(digits);
  }


  validatePhoneNumber(phone)
  {
    var phoneRe =  /^\(?(0[1-9]{1})\)?([0-9]{7})$/;
    var digits = phone.replace(/[-.]/g, "");
    return phoneRe.test(digits);
  }
  

  check_valid_fields()
  {
    if(this.msg.fullName === undefined || this.msg.phone === undefined 
      || this.msg.message === undefined)
       this.alert.showErrorMsg();

    else if(!this.validatePhoneNumber("0" + this.msg.phone) && !this.validateCellPhoneNumber("0" + this.msg.phone))
      this.alert.showErrorMsgPhone()
      
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
        fullName: this.msg.fullName,
        phoneNumber: this.msg.phone,
        message: this.msg.message,
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
