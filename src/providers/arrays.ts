import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';
@Injectable()

export class Arrays
{
    public hobbies: any[]
    public time: any[]
    public numOfMeeting: any[]
    public place: any []
    public gender: any[]
    public musicStyle: any[]
    public language: any[]
    public meetingWith: any[]
    public neighborhood: any[]
    public musical_instrument: any[]
    public dayOfMeeting: any[]

  constructor(public alertCtrl: AlertController)
  {
  
    this.hobbies = [
        {
          'species': 'מוסיקה / שירה',
          'currentValue': false
        }, {
          'species': 'שיחה',
          'currentValue': false
        }, {
          'species': 'קריאה',
          'currentValue': false
        }, {
          'species': 'טיול קצר',
          'currentValue': false
        }, {
          'species': 'פרשת השבוע',
          'currentValue': false
        }, {
          'species': 'משחקי קופסה',
          'currentValue': false
        }, {
        'species': 'סיוע טכנולגי במחשב / סלולרי',
        'currentValue': false
        } ,{
          'species': 'הכנת ספר מתכונים',
          'currentValue': false
        } ,{
          'species': 'כתיבת סיפור חיים',
          'currentValue': false
        } ,{
          'species': 'מופעי ליצנות',
          'currentValue': false
        }
      ];
  
    this.time = [
      {
        'species': 'בוקר',
        'currentValue': false
      }, {
        'species': 'אחה"צ',
        'currentValue': false
      }, {
        'species': 'ערב',
        'currentValue': false
      }, {
        'species': 'לא משנה',
        'currentValue': false
      }];
  
    this.numOfMeeting = [
      {
        'species': 'פעם בשבוע/ שבועיים',
        'currentValue': false
      }, {
        'species': 'פעם בחודש',
        'currentValue': false
      }, {
        'species': 'באופן אקראי',
        'currentValue': false
      }];

  
    this.place = [
      {
        'species': 'בבית הקשיש',
        'currentValue': false
      }, {
        'species': 'במועדון קשישים',
        'currentValue': false
      }, {
        'species': 'בשניהם',
        'currentValue': false
      }];


    this.gender = [
      {
        'species': 'נקבה',
        'currentValue': false
      }, {
        'species': 'זכר',
        'currentValue': false
      }];


    this.musicStyle = [
      {
        'species': 'שירי ארץ ישראל',
        'currentValue': false
      }, {
        'species': 'רוק / פופ',
        'currentValue': false
      }, {
        'species': 'קלאסי',
        'currentValue': false
      }, {
        'species': 'מזרחי',
        'currentValue': false
      }, {
        'species': 'גאז',
        'currentValue': false
      }, {
        'species': 'מוסיקת עולם',
        'currentValue': false
      }, {
      'species': 'חסידי / פיוטי',
      'currentValue': false
      } ];


    this.language= [
      {
        'species': 'עברית',
        'currentValue': false
      }, {
        'species': 'רוסית',
        'currentValue': false
      }, {
        'species': 'אמהרית',
        'currentValue': false
      }, {
        'species': 'ערבית',
        'currentValue': false
      }, {
        'species': 'אנגלית',
        'currentValue': false
      }, {
        'species': 'צרפתית',
        'currentValue': false
      }, {
      'species': 'ספרדית',
      'currentValue': false
      } ];


    this.meetingWith = [
      {
        'species': 'אין העדפה',
        'currentValue': false
      }, {
        'species': 'נשים בלבד',
        'currentValue': false
      }, {
        'species': 'גברים בלבד',
        'currentValue': false
      }];

      
    this.meetingWith = [
      {
        'species': 'אין העדפה',
        'currentValue': false
      }, {
        'species': 'נשים בלבד',
        'currentValue': false
      }, {
        'species': 'גברים בלבד',
        'currentValue': false
      }];


    this.neighborhood = [
      {
        'species': 'אזור פסגת זאב, נווה יעקב, רמות',
        'currentValue': false
      }, {
        'species': '(מרכז העיר (כולל קטמון, המושבה הגרמנית וכדומה',
        'currentValue': false
      }, {
        'species': 'אזור גילה, תלפיות, תלפ"ז, בקעה',
        'currentValue': false
      }, {
        'species': 'אזור בית הכרם, קריית היובל, גבעת משואה, עיר גנים, קריית מנחם ועין כרם',
        'currentValue': false
      }, {
        'species': 'אזור רוממה, גבעת שאול, קריית משה והר נוף',
        'currentValue': false
      }];


    this.musical_instrument = [
      {
        'species': 'שירה',
        'currentValue': false
      }, {
        'species': 'גיטרה',
        'currentValue': false
      }, {
        'species': 'חלילית / חליל צד',
        'currentValue': false
      }, {
        'species': 'פסנתר / קלידים',
        'currentValue': false
      }, {
        'species': 'תופים',
        'currentValue': false
      }, {
        'species': 'כלי נשיפה',
        'currentValue': false
      }];

    this.dayOfMeeting = [
      {
        'species': 'ראשון',
        'currentValue': false
      }, {
        'species': 'שני',
        'currentValue': false
      }, {
        'species': 'שלישי',
        'currentValue': false
      }, {
        'species': 'רביעי',
        'currentValue': false
      }, {
        'species': 'חמישי',
        'currentValue': false
      }, {
        'species': 'שישי',
        'currentValue': false
      }, {
        'species': 'שבת',
        'currentValue': false
      }];
    }

}