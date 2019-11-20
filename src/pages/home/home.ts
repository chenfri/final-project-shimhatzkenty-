import { Component} from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { Form } from '../form/form';
import { contactPage } from '../contactPage/contactPage'
import {RegisterPage} from '../register/register'
import {LoginPage} from '../login/login'
import { User } from '../../module/User'
import firebase, { firestore } from 'firebase';
import { IonicPage, AlertController } from 'ionic-angular';
import {adminPage} from '../Admin/adminPage'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage 
{
  user = {} as User;

  constructor(public navCtrl: NavController, public params: NavParams,public alertCtrl: AlertController)
  {
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    if(this.user.loggedIn)
      this.get_data_from_firebase();
  }


  get_data_from_firebase()
  {
    const db = firebase.firestore();

    db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
      .then(result =>{
        if (result.exists){
          this.user.elderly = true;
        }
        else
        {
          db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result =>{
            if (result.exists){
              this.user.volunteer = true;
          

          }
            else{
              db.collection('Admin').doc(firebase.auth().currentUser.uid).get()
              .then(result =>{
                if (result.exists){
                  this.user.Admin = true;  
                  this.navCtrl.push(adminPage);


                }
                else return;   })



            }
        }
       ) }


    })
   
  }

  

  elderly_form() {
    this.user.elderly = true;   
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn});
  }

  volunteer_form() {
    this.user.elderly = false;
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn});
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
