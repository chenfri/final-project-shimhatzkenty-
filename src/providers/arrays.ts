import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
@Injectable()

export class Arrays {

  public hobbies: any[]
  public hours: any[]
  public numOfMeeting: any[]
  public place: any[]
  public gender: any[]
  public musicStyle: any[]
  public language: any[]
  public meetingWith: any[]
  public musical_instrument: any[]
  public dayOfMeeting: any[]
  public organization: any[]
  public neighborhoods: any[]
  public relationship: any[]
  constructor(public alertCtrl: AlertController) {

    this.hobbies = [
      {
        'species': 'שיחת זום/ ווטסאפ',
        'currentValue': false
      },
      {
        'species': 'שיחת טלפון - אוזן קשבת',
        'currentValue': false
      },
      {
        'species': 'מוסיקה / שירה',
        'currentValue': false
      }, {
        'species': 'קריאה',
        'currentValue': false
      },
      //  {
      //   'species': 'טיול קצר',
      //   'currentValue': false
      // },
       {
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
      , {
        'species': 'אומנות/יצירה',
        'currentValue': false
      }

    ];


      this.hours = [
        {
          'species': 'כל שעה ביום',
          'currentValue': false
        },
        {
          'species': '8:00-10:00',
          'currentValue': false
        }, {
          'species': '10:00-12:00',
          'currentValue': false
        }, {
          'species': '12:00-14:00',
          'currentValue': false
        }, {
          'species': '14:00-16:00',
          'currentValue': false
        }, {
          'species': '16:00-18:00',
          'currentValue': false
        }, {
          'species': '18:00-20:00',
          'currentValue': false
        }];

      this.relationship = [
        {
          'species': 'בעל',
          'currentValue': false,
          'id': 1
        }, {
          'species': 'אישה',
          'currentValue': false,
          'id': 2
        }, {
          'species': 'בן/בת',
          'currentValue': false,
          'id': 3
        }, {
          'species': 'נכד/ה',
          'currentValue': false,
          'id': 4
        }, {
          'species': 'עו"ס',
          'currentValue': false,
          'id': 5
        }, {
          'species': 'רכז קהילתי',
          'currentValue': false,
          'id': 6
        }, {
          'species': 'אחר',
          'currentValue': false,
          'id': 7
        }];


    this.numOfMeeting = [
      {
        'species': 'פעם בשבוע',
        'currentValue': false,
        'id':1
      }, {
        'species': 'פעם בשבועיים',
        'currentValue': false,
        'id':2
      }, {
        'species': 'פעם בשלושה שבועות',
        'currentValue': false,
        'id':3
      }];


    this.place = [
      {
        'species': 'בבית הקשיש',
        'currentValue': false,
        'id':1
      }, {
        'species': 'במועדון קשישים',
        'currentValue': false,
        'id':2
      }, {
        'species': 'בשניהם',
        'currentValue': false,
        'id':3
      }];


    this.gender = [
      {
        'species': 'נקבה',
        'currentValue': false,
        'id': 1
      }, {
        'species': 'זכר',
        'currentValue': false,
        'id': 2
      }, {
        'species': 'לא רלוונטי',
        'currentValue': false,
        'id': 3
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
        'currentValue': false,
        'id' : 1
      }, {
        'species': 'נשים בלבד',
        'currentValue': false,
        'id' : 2
      }, {
        'species': 'גברים בלבד',
        'currentValue': false,
        'id' : 3
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
        'currentValue': false,
        'id' : 1
      }, {
        'species': 'מלבב',
        'currentValue': false,
        'id' : 2
      }, {
        'species': 'עזר מציון',
        'currentValue': false,
        'id' : 3
      }, {
        'species': 'אחר',
        'currentValue': false,
        'id' : 4
      }];


    this.neighborhoods = [
      { species: "א-טור", currentValue: false ,id: 1 },
      { species: "אבו תור מזרח", currentValue: false ,id: 2},
      { species: "בוכרים", currentValue: false ,id: 3},
      { species: "בית הכרם", currentValue: false ,id: 4},
      { species: "בית וגן", currentValue: false ,id: 5},
      { species: "בית חנינא", currentValue: false ,id: 6},
      { species: "בית צפאפא", currentValue: false ,id: 7},
      { species: "בקעה", currentValue: false ,id: 8},
      { species: "גבעת מרדכי", currentValue: false ,id: 9},
      { species: "גבעת משואה", currentValue: false ,id: 10},
      { species: "גבעת שאול", currentValue: false ,id: 11},
      { species: "קטמונים", currentValue: false ,id: 12},
      { species: "גילה", currentValue: false ,id: 13},
      { species: "הגבעה הצרפתית", currentValue: false ,id: 14},
      { species: "המושבה הגרמנית", currentValue: false ,id: 15},
      { species: "המושבה היוונית", currentValue: false ,id: 16},
      { species: "המושבה האמריקאית", currentValue: false ,id: 17},
      { species: "הר נוף", currentValue: false ,id: 18},
      { species: "הרובע הארמני", currentValue: false ,id: 19},
      { species: "הרובע היהודי", currentValue: false ,id: 20},
      { species: "הרובע המוסלמי", currentValue: false ,id: 21},
      { species: "הרובע הנוצרי", currentValue: false ,id: 22},
      { species: "ואדי ג'וז", currentValue: false ,id: 23},
      { species: "הר חומה", currentValue: false ,id: 24},
      { species: "טלביה", currentValue: false ,id: 25},
      { species: "ימין משה", currentValue: false ,id: 26},
      { species: "כפר עקב", currentValue: false ,id: 27},
      { species: "לב העיר", currentValue: false ,id: 28},
      { species: "מאה שערים", currentValue: false ,id: 29},
      { species: "מוסררה", currentValue: false ,id: 30},
      { species: "מלחה", currentValue: false ,id: 31},
      { species: "מעלות דפנה", currentValue: false ,id: 32},
      { species: "נווה יעקב", currentValue: false ,id: 33},
      { species: "סילואן", currentValue: false ,id: 34},
      { species: "סנהדריה", currentValue: false ,id: 35},
      { species: "עין כרם", currentValue: false ,id: 36},
      { species: "עיסוויה", currentValue: false ,id: 37},
      { species: "קרית מנחם", currentValue: false ,id: 38},
      { species: "פסגת זאב", currentValue: false ,id: 39},
      { species: "פת", currentValue: false ,id: 40},
      { species: "צור באחר", currentValue: false ,id: 41},
      { species: "קטמון", currentValue: false ,id: 42},
      { species: "קרית יובל", currentValue: false ,id: 43},
      { species: "קרית משה", currentValue: false ,id: 44},
      { species: "ראס אל עמוד", currentValue: false ,id: 45},
      { species: "רוממה", currentValue: false ,id: 46},
      { species: "רחביה", currentValue: false ,id: 47},
      { species: "רמות", currentValue: false ,id: 48},
      { species: "רמת אשכול", currentValue: false ,id: 49},
      { species: "רמת שלמה", currentValue: false ,id: 50},
      { species: "רמת שרת", currentValue: false ,id: 51},
      { species: "רמת דניה", currentValue: false ,id: 52},
      { species: "שועפט", currentValue: false ,id: 53},
      { species: "שייח ג'ראח", currentValue: false ,id: 54},
      { species: "שמואל הנביא", currentValue: false ,id: 55},
      { species: "תלפיות - ארנונה", currentValue: false ,id: 56},
      { species: "תלפיות מזרח", currentValue: false ,id: 57}
    ];


  }
}