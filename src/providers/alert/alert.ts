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
      subTitle: 'הרשמתך נקלטה בהצלחה!',
      buttons: ['אישור']
    });
    alert.present();
  }


  showError_language()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור שפה' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  showError_age()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא גיל' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  showError_otherField()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '"נא למלא שדה "אחר',
      buttons: ['אישור']
    });
    alert.present();
  }
  
  // showError_favoriteN()
  // {
  //   let alert = this.alertCtrl.create({
  //     title: 'שגיאה',
  //     subTitle: 'חובה לבחור שכונות מועדפות להתנדבות' ,
  //     buttons: ['אישור']
  //   });
  //   alert.present();
  // }
  

  showError_gender()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור מגדר' ,
      buttons: ['אישור']
    });
    alert.present();
  }



  showError_dayOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור ימים מועדפים' ,
      buttons: ['אישור']
    });
    alert.present();
  }


  showError_studentDetails()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא מוסד אקדמי' ,
      buttons: ['אישור']
    });
    alert.present();
  }


  showError_studentID()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'תעודת הזהות אינה תקינה' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  showError_behalf()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא שם ופלאפון תקין של איש קשר' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  showError_relationship()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא קרבה לקשיש/ ארגון' ,
      buttons: ['אישור']
    });
    alert.present();
  }


  showError_address()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא שכונה ורחוב מגורים' ,
      buttons: ['אישור']
    });
    alert.present();
  }


  error_emptyPhone()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא מספר פלאפון/טלפון תקין, ללא מקף',
      buttons: ['אישור']
    });
    alert.present();
  }

  
  error_emptyFullName()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא שם מלא',
      buttons: ['אישור']
    });
    alert.present();
  }


  error_illegalEmail()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com',
      buttons: ['אישור']
    });
    alert.present();
  }

  error_illegalEmailOrPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com <br> וסיסמה באורך 6 תווים לפחות',
      buttons: ['אישור']
    });
    alert.present();
  }


  error_phoneIsAllreadyExist()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'מספר הטלפון כבר קיים במערכת, יש להקיש מספר אחר',
      buttons: ['אישור']
    });
    alert.present();
  }

  error_emptyEmailOrPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל וסיסמה',
      buttons: ['אישור']
    });
    alert.present();
  }

  
  
  error_emailIsNotExist()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'כתובת הדואל לא קיימת , נא נסה שנית',
      buttons: ['אישור']
    });
    alert.present();
  }


 error_passwordIsIncorrect()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'סיסמה לא נכונה, נא נסה שנית',
      buttons: ['אישור']
    });
    alert.present();
  }


  showAlert_forgetPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'שים לב',
      subTitle: 'כעת נשלח לכתובת המייל שלך מייל לאחזור סיסמה' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  showAlert_sendMessage()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!ההודעה נשלחה בהצלחה',
      buttons: ['אישור']
    });
    alert.present();
  }


  showAlert_deleteMessage()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!ההודעה נמחקה בהצלחה',
      buttons: ['אישור']
    });
    alert.present();
  }


  showAlert_chooseRange()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'יש לבחור מרחק מקסימלי',
      buttons: ['אישור']
    });
    alert.present();
  }


  error_hobbies()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור תחום עניין אחד לפחות',
      buttons: ['אישור']
    });
    alert.present();
  }


  error_numOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:'חובה לבחור תדירות מפגשים',
      buttons: ['אישור']
    });
    alert.present();
  }
  error_hours()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:' חובה לבחור שעות מועדפות או לסמן כל שעה ביום',
      buttons: ['אישור']
    });
    alert.present();
  }

  error_emailIsAllreadyExist()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:'כתובת הדוא"ל כבר קיימת המערכת',
      buttons: ['אישור']
    });
    alert.present();
  }

    
  showAlert()
  {
    let alert = this.alertCtrl.create({
      title: '!הפרטים נשמרו בהצלחה',
      subTitle: 'שים לב, יש למלא את כל הטופס' ,
      buttons: ['אישור']
    });
    alert.present();
  }

  error_showAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'שים לב, יש למלא את כל הטופס' ,
      buttons: ['אישור']
    });
    alert.present();
  }
 

}
