import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController) {
  }


  signIn_function()
  {

    if(this.user.email == "" ||this.user.password == "")
      this.showAlertError2()
    else{

      firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(data=> {
      console.log(this.user.email)
      console.log(this.user.password)
      console.log("login success")
      this.navCtrl.push(HomePage);
  
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

