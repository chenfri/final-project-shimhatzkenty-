import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController ,NavParams} from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import {LoginPage} from '../login/login'
import {AlertProvider} from '../../providers/alert/alert'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;

  constructor(public alert: AlertProvider ,public navCtrl: NavController, public params: NavParams) {
        
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)
  }


  async registry()
  {
    if(this.user.email == "" ||this.user.password == "")
       this.alert.error_emptyEmailOrPassword();

    else
    {
      try{
        const res = await firebase.auth().createUserWithEmailAndPassword
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

click_home()
{
  this.navCtrl.push(HomePage , {'login': this.user.loggedIn, 'admin': this.user.Admin});
}

}
