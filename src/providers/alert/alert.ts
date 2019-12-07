import { Injectable } from '@angular/core';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
@Injectable()
export class AlertProvider
{

  constructor(public alertCtrl: AlertController) {
  }

  showAlertSuccess()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!הפרטים נשמרו בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }

  
  showAlert_changeEmailAndPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: 'כתובת הדוא"ל והסיסמה שונו בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }
  

  showAlert()
  {
    let alert = this.alertCtrl.create({
      title: '!הפרטים נשמרו בהצלחה',
      subTitle: 'שים לב, יש למלא את כל הטופס' ,
      buttons: ['OK']
    });
    alert.present();
  }


  error_emptyFields()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא את כל השדות',
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

  
  error_emailIsNotExist()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'כתובת הדואל לא קיימת , נא נסה שנית',
      buttons: ['OK']
    });
    alert.present();
  }


 error_passwordIsIncorrect()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'סיסמה לא נכונה, נא נסה שנית',
      buttons: ['OK']
    });
    alert.present();
  }


  showAlert_sendMessage()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!ההודעה נשלחה בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }


  error_hobbies()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור תחביב אחד לפחות',
      buttons: ['OK']
    });
    alert.present();
  }


  error_timeOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור זמן שמתאים למפגש',
      buttons: ['OK']
    });
    alert.present();
  }


  error_numOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:'חובה לבחור תדירות מפגשים',
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
