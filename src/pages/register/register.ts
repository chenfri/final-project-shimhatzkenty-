import { Component } from '@angular/core';
import { IonicPage, NavController ,NavParams} from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import {Functions} from '../../providers/functions'
import {AlertProvider} from '../../providers/alert/alert'
import {adminPage} from '../Admin/adminPage'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;

  constructor(public alert: AlertProvider ,public navCtrl: NavController,
     public params: NavParams, public func: Functions) {
        
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)
  }


  async registry()
  {
    let str =await this.func.registry(this.user.email, this.user.password)
    if(str == "sucsses")
    {
      this.alert.showAlertSuccess();
 
    
      const db = firebase.firestore();
      console.log(firebase.auth().currentUser.uid)
      db.collection('Admin').doc(firebase.auth().currentUser.uid).set({})
      .then(()=> {console.log("added new admin")
      this.navCtrl.push(HomePage, {'login': this.user.loggedIn, 'admin': this.user.Admin});
  })
    }
  }


  click_home()
  {
    this.navCtrl.push(HomePage , {'login': this.user.loggedIn, 'admin': this.user.Admin});
  }

}
