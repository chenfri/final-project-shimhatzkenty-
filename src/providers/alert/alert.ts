import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';
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


  showAlert_EmailVerfied()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה - לא ניתן להתחבר',
      subTitle: 'יש לאמת תחילה את כתובת הדוא"ל שלך במייל שנשלח לכתובת שהזנת' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_language()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור שפה' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_age()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא גיל' ,
      buttons: ['OK']
    });
    alert.present();
  }
  
  showError_zone()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור איזור' ,
      buttons: ['OK']
    });
    alert.present();
  }
  

  showError_musical_instrument()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור כלי נגינה' ,
      buttons: ['OK']
    });
    alert.present();
  }



  showError_dayOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור ימים מועדפים' ,
      buttons: ['OK']
    });
    alert.present();
  }


  showError_studentDetails()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא מוסד אקדמי' ,
      buttons: ['OK']
    });
    alert.present();
  }


  showError_studentID()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא ת"ז תקין כולל סיפרת ביקורת' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_behalf()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא פרטי איש קשר' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_relationship()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא קרבה לקשיש/ ארגון' ,
      buttons: ['OK']
    });
    alert.present();
  }


  showError_address()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא שכונה ורחוב מגורים' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_musicStyle()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור סגנון מוזיקלי' ,
      buttons: ['OK']
    });
    alert.present();
  }

  showError_meetingWith()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור עם מי המפגש יתקיים' ,
      buttons: ['OK']
    });
    alert.present();
  }
  

  showError_NotEmailVerfied()
  {
    let alert = this.alertCtrl.create({
      title: 'לתשומת ליבך!',
      subTitle: 'כעת נשלח מייל אימות לכתובת דוא"ל שהזנת, יש לאשר שהכתובת אכן נכונה' ,
      buttons: ['OK']
    });
    alert.present();
  }

  error_showAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
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


  showAlert_deleteMessage()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!ההודעה נמחקה בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }


  showAlert_chooseRange()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'יש לבחור מרחק מקסימלי',
      buttons: ['OK']
    });
    alert.present();
  }


  error_hobbies()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור תחום עניין אחד לפחות',
      buttons: ['OK']
    });
    alert.present();
  }


  
  error_place()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור מקום התנדבות',
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
