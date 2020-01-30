import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
@Injectable()

export class Arrays {

  public hobbies: any[]
  public time: any[]
  public numOfMeeting: any[]
  public place: any[]
  public gender: any[]
  public musicStyle: any[]
  public language: any[]
  public meetingWith: any[]
  public zone: any[]
  public musical_instrument: any[]
  public dayOfMeeting: any[]
  public organization: any[]
  public durationVol: any[]
  public neighborhoods: any[]

  constructor(public alertCtrl: AlertController) {

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
      }, {
        'species': 'הכנת ספר מתכונים',
        'currentValue': false
      }, {
        'species': 'כתיבת סיפור חיים',
        'currentValue': false
      }, {
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
        'species': 'פעם בשבוע',
        'currentValue': false
      }, {
        'species': 'פעם בשבועיים',
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
      }];


    this.language = [
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


    this.zone = [
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


    this.organization = [
      {
        'species': 'יד שרה',
        'currentValue': false
      }, {
        'species': 'מלבב',
        'currentValue': false
      }, {
        'species': 'עזר מציון',
        'currentValue': false
      }];


    /*this.durationVol = [
      {
        'species': 'שישה חודשים',
        'currentValue': false
      }, {
        'species': 'תשעה חודשים',
        'currentValue': false
      }
    ]*/


    this.neighborhoods = [
      { species: "א-טור", currentValue: false },
      { species: "אבו תור מזרח", currentValue: false },
      { species: "בוכרים", currentValue: false },
      { species: "בית הכרם", currentValue: false },
      { species: "בית וגן", currentValue: false },
      { species: "בית חנינא", currentValue: false },
      { species: "בית צפאפא", currentValue: false },
      { species: "בקעה", currentValue: false },
      { species: "גבעת מרדכי", currentValue: false },
      { species: "גבעת משואה", currentValue: false },
      { species: "גבעת שאול", currentValue: false },
      { species: "קטמונים", currentValue: false },
      { species: "גילה", currentValue: false },
      { species: "הגבעה הצרפתית", currentValue: false },
      { species: "המושבה הגרמנית", currentValue: false },
      { species: "המושבה היוונית", currentValue: false },
      { species: "המושבה האמריקאית", currentValue: false },
      { species: "הר נוף", currentValue: false },
      { species: "הרובע הארמני", currentValue: false },
      { species: "הרובע היהודי", currentValue: false },
      { species: "הרובע המוסלמי", currentValue: false },
      { species: "הרובע הנוצרי", currentValue: false },
      { species: "ואדי ג'וז", currentValue: false },
      { species: "הר חומה", currentValue: false },
      { species: "טלביה", currentValue: false },
      { species: "ימין משה", currentValue: false },
      { species: "כפר עקב", currentValue: false },
      { species: "לב העיר", currentValue: false },
      { species: "מאה שערים", currentValue: false },
      { species: "מוסררה", currentValue: false },
      { species: "מלחה", currentValue: false },
      { species: "מעלות דפנה", currentValue: false },
      { species: "נווה יעקב", currentValue: false },
      { species: "סילואן", currentValue: false },
      { species: "סנהדריה", currentValue: false },
      { species: "עין כרם", currentValue: false },
      { species: "עיסוויה", currentValue: false },
      { species: "קרית מנחם", currentValue: false },
      { species: "פסגת זאב", currentValue: false },
      { species: "פת", currentValue: false },
      { species: "צור באחר", currentValue: false },
      { species: "קטמון", currentValue: false },
      { species: "קרית יובל", currentValue: false },
      { species: "קרית משה", currentValue: false },
      { species: "ראס אל עמוד", currentValue: false },
      { species: "רוממה", currentValue: false },
      { species: "רחביה", currentValue: false },
      { species: "רמות", currentValue: false },
      { species: "רמת אשכול", currentValue: false },
      { species: "רמת שלמה", currentValue: false },
      { species: "רמת שרת", currentValue: false },
      { species: "רמת דניה", currentValue: false },
      { species: "שועפט", currentValue: false },
      { species: "שייח ג'ראח", currentValue: false },
      { species: "שמואל הנביא", currentValue: false },
      { species: "תלפיות - ארנונה", currentValue: false },
      { species: "תלפיות מזרח", currentValue: false }
    ];


  }
}