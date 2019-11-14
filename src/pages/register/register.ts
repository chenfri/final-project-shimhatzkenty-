import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;

  constructor(public alertCtrl: AlertController ,public navCtrl: NavController) {
  }


  showAlert()
  {
    let alert = this.alertCtrl.create({
      title: '!הפרטים נשמרו בהצלחה',
      subTitle: 'שים לב, יש למלא טופס פרטים אישיים' ,
      buttons: ['OK']
    });
    alert.present();
  }


 async registry()
  {
    console.log(this.user.email);
    console.log(this.user.password);
    try{
      const res = await firebase.auth().createUserWithEmailAndPassword
      (this.user.email, this.user.password);
      if(res)
      {
        console.log(res.user.uid);
        this.showAlert();
        this.navCtrl.push(HomePage);
      }
    }
    catch(e)
    {
      console.error(e);
    }
  }

}
