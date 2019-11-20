import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Form } from '../form/form';
import { contactPage } from '../contactPage/contactPage'
import {RegisterPage} from '../register/register'
import {LoginPage} from '../login/login'
import { User } from '../../module/User'
import firebase, { firestore } from 'firebase';
import {  ViewController , NavParams, ModalController, ModalOptions, Modal } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage 
{
  user = {} as User;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public params: NavParams,  public viewCtrl : ViewController)
  {
    
    firebase.auth().onAuthStateChanged((user) =>{
      if(user)
        this.user.loggedIn = true;
      else
        this.user.loggedIn = false;
    });
    //this.closeModal();
  }

  public closeModal(){
  
    let data = { 'name':'myName','id':'456123' };
    this.viewCtrl.dismiss(data);
    }

  elderly_form() {
    this.user.elderly = true;
    //this.closeModal();
    
    this.navCtrl.push(Form, { 'elderly':this.user.elderly});
  
  //  this.user.elderly = true;
  }
  volunteer_form() {
    this.navCtrl.push(Form);
    this.user.elderly = false;
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
