import { Injectable } from '@angular/core';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { User } from '../module/user'
import {AlertProvider} from './alert/alert'
import firebase, { firestore } from 'firebase';
@Injectable()
export class Functions
{


    user = {} as User;
  constructor(public alertCtrl: AlertController, public alert: AlertProvider) {
  }


  async registry(email, password)
  {
    console.log(email)
    console.log(password)
    if (email == "undefined" || password == "undefined")
      this.alert.error_emptyEmailOrPassword();
    else
    {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (res)
          return "sucsses"
      }
      catch (e) {
        console.error(e);
        if (e.message == "The email address is already in use by another account.")
          this.alert.error_emailIsAllreadyExist();
        else
          this.alert.error_illegalEmailOrPassword();
      }
    }
}

}
