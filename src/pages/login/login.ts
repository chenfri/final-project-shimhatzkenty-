import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user= {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private ofauth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signIn_function()
  {
    const res = this.ofauth.auth.signInWithEmailAndPassword(this.user.email , this.user.password);
    if(res)
       this.navCtrl.push(HomePage);
  }
  catch(e)
  {
    if(typeof( this.user.email) === "undefined" || typeof( this.user.password) === "undefined")
       alert("חובה להכניס כתובת דואל וסיסמא");
    else //check this.
       alert("הפרטים אינם נכונים");
     console.error(e); 
  }
  
  }

