import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController ,NavParams} from 'ionic-angular';
import { User } from '../../module/user';
import { HomePage } from '../home/home';
import * as firebase from 'firebase/app';
import {LoginPage} from '../login/login'

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;

  constructor(public alertCtrl: AlertController ,public navCtrl: NavController, public params: NavParams) {
        
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
       this. error_emptyEmailOrPassword();

    else
    {

      try{
        const res = await firebase.auth().createUserWithEmailAndPassword
        (this.user.email, this.user.password);
        if(res)
          this.showAlert();
      }
      catch(e)
      {
        console.error(e);
        if(e.message == "The email address is already in use by another account.")
          this.error_emailIsAllreadyExist();
        else
          this.error_illegalEmailOrPassword();
      }
  }
}

click_home()
{
  this.navCtrl.push(HomePage , {'login': this.user.loggedIn, 'admin': this.user.Admin});
}



   //---------- diffrent methods for errors ---------------
   showAlert()
   {
     let alert = this.alertCtrl.create({
       title: 'בוצע',
       subTitle: '!הפרטים נשמרו בהצלחה' ,
       buttons: ['OK']
     });
     alert.present();
   }
   
   error_emptyEmailOrPassword()
   {
     let alert = this.alertCtrl.create({
       title: 'שגיאה',
       subTitle: '!חובה למלא כתובת דוא"ל וסיסמא',
       buttons: ['OK']
     });
     alert.present();
   }
 
 
   error_illegalEmailOrPassword()
   {
     let alert = this.alertCtrl.create({
       title: 'שגיאה',
       subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com <br> וסיסמא באורך של 6 תווים לפחות',
       buttons: ['OK']
     });
     alert.present();
   }
 
   error_emailIsAllreadyExist()
   {
     let alert = this.alertCtrl.create({
       title: 'שגיאה',
       subTitle:'כתובת הדוא"ל כבר קיימת המערכת',
       buttons: ['OK']
     });
     alert.present();
   }

}
