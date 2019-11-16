import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Form } from '../form/form';
import { contactPage } from '../contactPage/contactPage'
import {RegisterPage} from '../register/register'
import {LoginPage} from '../login/login'
import { User } from '../../module/User'
import firebase, { firestore } from 'firebase';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage 
{
  user = {} as User;

  constructor(public navCtrl: NavController) {
    if(firebase.auth().currentUser != null)
      this.user.loggedIn = true;
    else  
     this.user.loggedIn = false;

  }

  form() {
    this.navCtrl.push(Form);
  }
  contactPage() {
    this.navCtrl.push(contactPage);
  }

  registry(){
    this.navCtrl.push(RegisterPage);
  }


  login(){
    this.navCtrl.push(LoginPage);
  }
  
  // logout() {
  //   this.fAuth.auth.signOut();
  //   this.navCtrl.push(LoginPage);
  // }

}
