import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import { Form } from '../form/form';
import {adminPage} from '../Admin/adminPage'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user= {} as User;
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController) {
    this.user.loggedIn = false;
  }


  signIn_function()
  {

    if(this.user.email == "" ||this.user.password == "")
      this.showAlertError2()
    else
    {
      firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(data=> {
      console.log(this.user.email)
      console.log(this.user.password)
      console.log("login success")
      this.user.loggedIn = true;

      const db = firebase.firestore();

      db.collection('Admin').doc(firebase.auth().currentUser.uid).get().then(result =>{
        if (result.exists){
            this.user.Admin = true;  
            this.navCtrl.push(adminPage);
        }
     })


      this.navCtrl.push(HomePage, {'login': this.user.loggedIn});
      
      }).catch(error => {
        this.showAlertError3();
      console.error(error); 

      })
    }
  }

  showAlertError2()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא כתובת דוא"ל וסיסמא',
      buttons: ['OK']
    });
    alert.present();
  }
  

  showAlertError3()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com <br> וסיסמא באורך של 6 תווים לפחות',
      buttons: ['OK']
    });
    alert.present();
  }
  
  }

