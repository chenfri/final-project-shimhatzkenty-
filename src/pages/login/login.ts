import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import { Form } from '../form/form';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user= {} as User;
  constructor(public navCtrl: NavController, public navParams: NavParams, /*private ofauth: AngularFireAuth*/) {
  }


  signIn_function()
  {
    const res = firebase.auth().signInWithEmailAndPassword(this.user.email , this.user.password);
    if(res){
      console.log("success")
      console.log(firebase.auth().currentUser.uid);
       this.navCtrl.push(HomePage);
    }
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

