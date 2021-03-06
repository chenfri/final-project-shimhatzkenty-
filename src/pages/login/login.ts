import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController , public auth: AngularFireAuth, public alert: AlertProvider)
  {
    this.user.loggedIn = false;
    this.user.Admin = false;
    this.user.organization = false;
    this.user.elderly = false;
    this.user.volunteer = false;

  }

  signIn_function()
  {

    if(this.user.email == "" ||this.user.password == "")
      this.alert.error_emptyEmailOrPassword();
    else
    {
      firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(user =>
      {
          this.user.loggedIn = true;
          const db = firebase.firestore();
          //check if the user is sign in is admin
          db.collection('Admin').doc(firebase.auth().currentUser.uid).get()
            .then(result =>
            {
            if(result.exists)
                this.user.Admin = true;
                this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin , 'IDlogged':firebase.auth().currentUser.uid}); 
            })

            db.collection('organizations').doc(firebase.auth().currentUser.uid).get()
            .then(result =>
            {
            if(result.exists)
                this.user.organization = true;
                this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'organization': this.user.organization,'admin': this.user.Admin , 'IDlogged':firebase.auth().currentUser.uid}); 
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
      this.alert.error_emptyPassword();
    else
    {
      return this.auth.auth.sendPasswordResetEmail(this.user.email).then(() => {this.alert.showAlert_forgetPassword()}).
      catch(error => { 
        if(error.code == "auth/user-not-found")
          this.alert.error_emailIsNotExist();

    })
  }
  } 


  click_home()
  {
    this.navCtrl.setRoot(HomePage)
  }

}
