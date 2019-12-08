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


   registry()
  {
    if(this.user.email == "undefined" ||this.user.password == "undefined")
    this.alert.error_emptyEmailOrPassword();
else
{

  try{
    const res =  firebase.auth().createUserWithEmailAndPassword
    (this.user.email, this.user.password);
    if(res)
      this.alert.showAlert();
  }
  catch(e)
  {
    console.error(e);
    if(e.message == "The email address is already in use by another account.")
      this.alert.error_emailIsAllreadyExist();
    else
      this.alert.error_illegalEmailOrPassword();
  }
}
}

}
