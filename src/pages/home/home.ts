import { Component} from '@angular/core';
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

  constructor(public navCtrl: NavController)
  {
  
    firebase.auth().onAuthStateChanged((user) =>{
      if(user)
      {
        this.user.loggedIn = true;
        this.get_data_from_firebase();
      }
      else
        this.user.loggedIn = false;
    });
  }


  get_data_from_firebase()
  {
    const db = firebase.firestore();

      db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
      .then(result =>{
        if (result.exists)
          this.user.elderly = true;
        else
        {
          db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result =>{
            if (result.exists)
              this.user.elderly = false;
            else return;
        }
       ) }
    })
  }
  

  elderly_form() {
    this.user.elderly = true;   
    this.navCtrl.push(Form, { 'elderly':this.user.elderly});
  }

  volunteer_form() {
    this.user.elderly = false;
    this.navCtrl.push(Form, { 'elderly':this.user.elderly});
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
  
   logout() {
    firebase.auth().signOut();
    this.navCtrl.push(HomePage);
 }

}
