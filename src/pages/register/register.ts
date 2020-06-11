import { Component } from '@angular/core';
import { IonicPage, NavController ,NavParams} from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import {Functions} from '../../providers/functions'
import {AlertProvider} from '../../providers/alert/alert'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;
  whichPage:number;
  contactName:string;
  contactPhone:number;
  organizationName:string;


  constructor(public alert: AlertProvider ,public navCtrl: NavController,
     public params: NavParams, public func: Functions) {
        
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)

    console.log("whichPage:")
    this.whichPage = this.params.get('whichPage');
    console.log(this.whichPage)
  }


  async registry()
  {
    let str =await this.func.registry(this.user.email, this.user.password)
    if(str == "sucsses")
    {
      this.alert.showAlertSuccessAdmin()
      const db = firebase.firestore();

      if(this.whichPage == 1){
          db.collection('Admin').doc(firebase.auth().currentUser.uid).set({})
          .then(()=> {console.log("added new admin")
          this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
          })
      }
      else{
        db.collection('organizations').doc(firebase.auth().currentUser.uid).set({
          contactName: this.contactName,
          contactPhone:this.contactPhone,
          organizationName:this.organizationName,
          email: this.user.email
          
        
        })
        .then(()=> {console.log("added new organization")
        this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
        })
      }
    }
  }


  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

}
