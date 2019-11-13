import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../module/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage
{
  user= {} as User;

  constructor(public alertCtrl: AlertController ,public navCtrl: NavController,
    private ofauth:AngularFireAuth) {
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
    try{
      const res = await this.ofauth.auth.createUserWithEmailAndPassword
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
