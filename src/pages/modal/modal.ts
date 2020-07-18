import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { NavParams, PopoverController} from 'ionic-angular';
import {AlertProvider} from '../../providers/alert/alert'
import { PopoverPage } from '../popover/popover';
import firebase from 'firebase';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})

export class ModalPage {
  public whichPage: string;
  public parameters: any[];
  waitingForAdminAcceptList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  userE : any[]
  userV : any[]

  constructor(public navParams: NavParams, params: NavParams,private modal: ViewController, public alert: AlertProvider,public popoverCtrl: PopoverController) {
    this.whichPage = params.get('whichPage')
    console.log('whichPage', this.whichPage);


    this.userE =  this.navParams.get('userE');
    console.log('userE: ', this.userE);

    this.userV =  this.navParams.get('userV');
    console.log('userV: ', this.userV);

    if(this.whichPage == "matchAccept")
        this.getWaitingList()

    console.log("listtt: ", this.waitingForAdminAcceptList)

    this.parameters = [{
      'species': 'ימים',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שעות',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'מעוניין להיפגש עם',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'תחומי עניין',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שפות',
      'currentValue': false,
      'Threshold' : false
    }]

  }

  getWaitingList()
  {
    var volIdDoc;

    for(var iE = 0 ; iE < this.userE.length ; iE++)
    {
      if(this.userE[iE].status == -1)
      {
        volIdDoc = this.userE[iE].matching.id;

        for(var iV = 0 ; iV < this.userV.length; iV++)
        {
          if(this.userV[iV].docID == volIdDoc){
              this.waitingForAdminAcceptList.push({elderlyIdDoc: iE ,volIdDoc: iV})
              break;
          }
        }
      }
      }
  }


  adminAcceptence(match , type)
  {
    console.log('matchToaccept:  ', match)
    const db = firebase.firestore();

    if(type == "accept")
    {

      
      db.collection('ElderlyUsers').doc(this.userE[match.elderlyIdDoc].docID).update(
      {
          matching: this.userE[match.elderlyIdDoc].matching,
          status: 1
        }).catch((error) => {console.log(error)})
        
        
      db.collection('volunteerUsers').doc(this.userV[match.volIdDoc].docID).update(
      {
        matching: this.userE[match.elderlyIdDoc].docID,
        status: 1
      }).catch((error) => {console.log(error)})


      this.userE[match.elderlyIdDoc].status = 1

      //send emails and sms
      // this.sendEmailsVolunteer(this.userV[match.volIdDoc].name, this.userV[match.volIdDoc].email)
      // if(this.userE[match.elderlyIdDoc].email != null)
      //   this.sendEmailsElder(this.userE[match.elderlyIdDoc].nameAssistant, this.userE[match.elderlyIdDoc].name, this.userE[match.elderlyIdDoc].email)
      // if(this.userV[match.volIdDoc].phone.length == 9)
      //   this.sendSMS("+972" + this.userV[match.volIdDoc].phone, this.userV[match.volIdDoc].name)
      }
    

    else if(type == "reject")
    {
      db.collection("volunteerUsers").doc(this.userV[match.volIdDoc].docID).update({
        status: 0,
        matching: null,
      }).catch(error => {console.log(error)}) 
    
    
      db.collection("ElderlyUsers").doc(this.userE[match.elderlyIdDoc].docID).update({
        matching:{id: "", grade: 0, date: ""},
        status: 0
      }).catch(error => {console.log(error)})

      this.userE[match.elderlyIdDoc].status = 0
    }

  }
    // modal for get 'more details' about the users
    async openPopover(event , uid, userType)
    {
      console.log("openPopover")
      let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType },{cssClass: 'custom-popover'});
      popover.present({
        ev: event
      });
    }
  async closeModal()
  {
    this.modal.dismiss("closed")
  }



  async passParams()
  {
    let chosen = false
    for(let i = 0 ; i < this.parameters.length; i++)
      if(this.parameters[i].currentValue)
        chosen = true

    if(!chosen)
      this.alert.error_params();
    else
      this.modal.dismiss(this.parameters );
  }

  
  radioClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(!element.Threshold && element.currentValue)
          element.Threshold = true
        else
          element.Threshold = false
      }
    });

    console.log('parameters',this.parameters) 
  }


  CheckboxClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(element.currentValue)
          element.currentValue = false
        else
          element.currentValue = true
      }
    });

    //console.log('parameters',this.parameters) 
  }



  sendEmailsVolunteer(username, email)
  {
    let text = "שלום "+ username +",\nרצינו לעדכן אותך שמצאנו לך התאמה :)\n" +
    "לפרטים נוספים לחץ/י על הקישור ובצע/י התחברות עם כתובת המייל והסיסמה שלך\n" +
    "לאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות' bit.ly/2WDBZTZ \n\n" +
    "תודה על שיתוף הפעולה,\n" +
    "שמחת זקנתי"

    let subject =  "נמצאה לך התאמה באתר שמחת זקנתי!"

    let sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail({email: email, subject: subject, text: text}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendEmail functions - ", error.message ,error.code)
    });
  }



  //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsElder(username , nameE, email)
  {
    let text = "שלום "

    if(username != undefined)
      text += username +",\n";   
    else
      text += nameE +",\n";

    if(username != nameE && username != undefined)
    {
      text +="רצינו לעדכן אותך שנמצאה התאמה עבור אזרח ותיק שרשמת באתר שלנו"
      if(nameE != "חסוי")
        text += " - " + nameE;

      text +=  "\nבימים הקרובים יצרו עמכם קשר\n\n"
    }
    
    else
      text += "רצינו לעדכן אותך שנמצאה עבורך התאמה :) \nבימים הקרובים יצרו עימך קשר,\n\n"

    text +="בברכה,\nצוות שמחת זקנתי"

    let subject =  "נמצאה התאמה באתר שמחת זקנתי!"

    let sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail({email: email, subject: subject, text: text}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendEmail functions - ", error.message ,error.code)
    });
  }



  //this code is call sendSms (firebase Functions) from backend
  sendSMS(number , name)
  {
    let msg =  "שלום " + name + ",\nנמצאה לך התאמה באתר שמחת זקנתי!\nלפרטים נוספים יש להיכנס לאתר ולבצע התחברות עם כתובת מייל וסיסמה\nלאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות'\nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי"
    let sendEmail = firebase.functions().httpsCallable('sendSms');

    sendEmail({number: number , msg: msg}).then(function(result) {
      console.log("success calling sendSms1 - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendSms1 functions - ", error.message ,error.code)
    });
  }

}