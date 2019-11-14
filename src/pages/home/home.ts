import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Form } from '../form/form';
import {RegisterPage} from '../register/register'
import {LoginPage} from '../login/login'



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }


  form() {
    this.navCtrl.push(Form);
  }

  registry()
  {
    this.navCtrl.push(RegisterPage);
  }


  login()
  {
    this.navCtrl.push(LoginPage);
  }
  
  // logout() {
  //   this.fAuth.auth.signOut();
  //   this.navCtrl.push(LoginPage);
  // }

}
