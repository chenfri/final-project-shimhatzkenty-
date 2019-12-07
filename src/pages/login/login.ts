import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {AlertProvider} from '../../providers/alert/alert'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage
{
  user= {} as User;

  constructor(public navCtrl: NavController ,public alertCtrl: AlertController,
     private auth: AngularFireAuth, public alert: AlertProvider)
  {
    this.user.loggedIn = false;
    this.user.Admin = false;
    this.user.elderly = false;
    this.user.volunteer = false;
  }

  signIn_function()
  {

    if(this.user.email == "" ||this.user.password == "")
      this.alert.error_emptyEmailOrPassword();
    else
    {
      firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(data =>
      {
      this.user.loggedIn = true;
      const db = firebase.firestore();
      db.collection('Admin').doc(firebase.auth().currentUser.uid).get()
        .then(result =>
        {
         if(result.exists)
            this.user.Admin = true;
            this.navCtrl.push(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin,
             'elderly':this.user.elderly,'volunteer':this.user.volunteer});
        })
      }).catch(error => {
        if(error.code == "auth/user-not-found")
          this.alert.error_emailIsNotExist();
        else if (error.code == "auth/wrong-password")
          this.alert.error_passwordIsIncorrect();
        else
          this.alert.error_illegalEmailOrPassword();
      console.error(error); 
      })
    }
  }


  resetPassword()
  { 
    if(this.user.email == "")
      this.alert.error_emptyEmailOrPassword();
    else
      return this.auth.auth.sendPasswordResetEmail(this.user.email) 
  } 

}
