import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';
@Injectable()

export class Arrays
{
    public hobbies: any[]
    public time: any[]
    public numOfMeeting: any[]
    public place: any []

    constructor(public alertCtrl: AlertController)
    {
  
    this.hobbies = [
        {
          'species': 'מוסיקה',
          'currentValue': false
        }, {
          'species': 'תיאטרון',
          'currentValue': false
        }, {
          'species': 'קסמים',
          'currentValue': false
        }, {
          'species': 'ריקוד',
          'currentValue': false
        }, {
          'species': 'אומנות',
          'currentValue': false
        }, {
          'species': 'משחקי קופסה',
          'currentValue': false
        }, {
        'species': 'דיבור',
        'currentValue': false
        } ,{
          'species': 'אחר',
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
  
    }
}