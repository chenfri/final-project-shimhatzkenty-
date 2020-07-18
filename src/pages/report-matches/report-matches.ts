import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { User } from '../../module/User';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { PopoverPage } from '../popover/popover';

@IonicPage()
@Component({
  selector: 'page-report-matches',
  templateUrl: 'report-matches.html',
})
export class ReportMatchesPage {

  user = {} as User
  userE : any[]
  userV : any[]
  matchesFoundList :{elderlyIdDoc: any,volIdDoc: any}[] =[] 
  ElderMatchesNotFound: any[] =[] ;
  VolMatchesNotFound: any[] =[] ;
  notConfirmedMatchesList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  acceptedMatchesList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  waitingForAdminAcceptList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  MeetingList: {elderlyIdDoc: any,volIdDoc: any , date: any}[] =[] ;
  RejectedMatch: {volName: any,  volIdDoc: any, elderlyName: any,  elderlyIdDoc: any,  reason: any}[] =[] ;
  IDlogged:any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)

    //reverse dates in the tables
    for(let i = 0 ;i < this.userE.length ;i++)
    {
      if(this.userE[i].status != 0 || this.userE[i].status != -1)
      {
        let date = this.userE[i].matching.date
        let date2 = this.userE[i].matching.meetingDate
        if(date2)
          this.userE[i].matching.meetingDate = date2.split("-").reverse().join("-");      
        this.userE[i].matching.date = date.split("-").reverse().join("-");
      }
    }
   
   
    this.getDataToLists();
  
    // console.log('VolMatchesNotFound:',this.VolMatchesNotFound)
    // console.log('EldermatchesNotFound:',this.ElderMatchesNotFound)
    // console.log('notConfirmedMatchesList:',this.notConfirmedMatchesList)
    // console.log('acceptedMatchesList: ', this.acceptedMatchesList)
    console.log('meetingList:', this.MeetingList)
    // console.log('RejectedMatch:',this.RejectedMatch)
    // console.log('matchesFoundList:',this.matchesFoundList)
    // console.log('waitingForAdminAcceptList:',this.waitingForAdminAcceptList)

 }


//the method initialize all tables
  getDataToLists()
  {
    var volIdDoc, volName;

    for(var iV = 0 ; iV < this.userV.length; iV++) 
    {
      if(this.userV[iV].status == 0 || this.userV[iV].status == -1) // volunteers not found for them matching
        this.VolMatchesNotFound.push(this.userV[iV].index)

      else if(this.userV[iV].rejected != null) // rejected table
      {
        volName = this.userV[iV].name
        this.userV[iV].rejected.forEach(element => {
          for(var iE = 0 ; iE < this.userE.length ; iE++)
          {
            if(element.id == this.userE[iE].docID)
              this.RejectedMatch.push(
              {
                  volName: volName,
                  volIdDoc: this.userV[iV].docID,
                  elderlyName: this.userE[iE].name,
                  elderlyIdDoc: this.userE[iE].docID,
                  reason: element.reason
              })
          }});
      }

      
      let tmp = this.userV[iV].arrDates
      if(tmp != null)
      {
        for(let i = 0 ; i < tmp.length; i++)
          this.MeetingList.push({elderlyIdDoc: this.findElderIndex(tmp[i].idElder) ,volIdDoc: this.userV[iV].index,
            date:tmp[i].date })
        
      }
      
    }


    for(var iE = 0 ; iE < this.userE.length ; iE++)
    {
      if(this.userE[iE].status == 0) // elderly not found for them matching
        this.ElderMatchesNotFound.push(this.userE[iE].index)
    
      else if(this.userE[iE].matching.id != "")
      {
        volIdDoc = this.userE[iE].matching.id;

        for(var iV = 0 ; iV < this.userV.length; iV++)
        {
          
          if(this.userV[iV].docID == volIdDoc)
          {

            this.matchesFoundList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})

            if(this.userV[iV].status == 1)
              this.notConfirmedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})
      
            else if(this.userV[iV].status == 2)
              this.acceptedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})

            else if(this.userV[iV].status == -1)
              this.waitingForAdminAcceptList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})
          }
        }
      }
   } 
  }  


//the method return the index of matched elderly
  findElderIndex(id)
  {
    for(let i = 0; i < this.userE.length; i++)
      if(this.userE[i].docID == id)
        return this.userE[i].index
  }



  //handle with the case that admin accept matching from algorithm
  adminAcceptence(match , type)
  {
    console.log('matchToaccept:  ', match)
    const db = firebase.firestore();

    if(type == "accept"){
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
      this.sendEmailsVolunteer(this.userV[match.volIdDoc].name, this.userV[match.volIdDoc].email)
      if(this.userE[match.elderlyIdDoc].email != null)
        this.sendEmailsElder(this.userE[match.elderlyIdDoc].nameAssistant, this.userE[match.elderlyIdDoc].name, this.userE[match.elderlyIdDoc].email)
      if(this.userV[match.volIdDoc].phone.length == 9)
        this.sendSMS("+972" + this.userV[match.volIdDoc].phone, this.userV[match.volIdDoc].name)
    }

    else if(type == "reject")
    {
      db.collection("volunteerUsers").doc(this.userV[match.volIdDoc].docID).update({
        status: 0,
        matching: null,
        dateSendRemider: ""
      }).catch(error => {console.log(error)}) 
    
    
      db.collection("ElderlyUsers").doc(this.userE[match.elderlyIdDoc].docID).update({
        matching:{id: "", grade: 0, date: ""},
        status: 0
      }).catch(error => {console.log(error)})

      this.userE[match.elderlyIdDoc].status = 0
    }
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


    // modal for get 'more details' about the users
    async openPopover(event , uid, userType)
    {
      console.log("openPopover")
      let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType },{cssClass: 'custom-popover'});
      popover.present({
        ev: event
      });
    }


  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin, 'IDlogged':this.IDlogged }); 
  }

}
