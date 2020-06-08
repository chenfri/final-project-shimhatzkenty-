import { NavController,NavParams, AlertController, PopoverController ,Events} from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import { PopoverPage } from '../popover/popover';


@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
{
  user = {} as User
  organizationName: any;
  userE : any[]
  userV : any[]
  organizationEledry : any[]
  messages : any[]
  csvData: any[] = []
  headerRow: any[] = []
  public organizations: any[]
  public matchE: any;
  public matchV: any;
  public date: any;
  public adminComments: any;
  public studentArr :any[] = [];
 
 
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController ,
     public alert: AlertProvider, private event: Events, public popoverCtrl: PopoverController) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');
   
    this.matchE = null;
    this.matchV = null;
    this.date = new Date().toISOString().substring(0, 10);
    //this.sendSMS("+972508591865", "חן")

    this.sortArrByDates(this.userV)
    console.log(this.userV);
    this.sortArrByDates(this.userE)
    console.log(this.userE);

    let j = 0;
    for(let i = 0 ; i < this.userV.length; i++)
    {
      if(this.userV[i].student){
        this.studentArr[j] = this.userV[i]
        j++}
    }
      console.log(this.studentArr)
  }


  saveConnemnts()
  {
    this.save_AdminComments(this.userV, "volunteerUsers")
    this.save_AdminComments(this.userE, "ElderlyUsers")
  }


  save_AdminComments(arr, collection)
  {
    const db = firebase.firestore();
    for(let i = 0; i < arr.length; i++)
    {
      if(arr[i].commentTmp != arr[i].adminComments) // save only if the comment was change
          db.collection(collection).doc(arr[i].docID).update({
          adminComments: arr[i].adminComments
          }) .catch((error) => {console.log(error)})
    }
  }


  sortArrByDates(arr)
  {
    arr.sort(function(a,b){
      var da = new Date(a.date).getTime();
      var db = new Date(b.date).getTime();
      
      return da < db ? 1 : da > db ? -1 : 0
    });
  }


  //create excel file with the rellevant data
  csvFile(array , type)
  {
    let tmp= [] ; let j = 0 

    if(array != null || array != undefined)
    {
      for(let i = 0 ; i < array.length ; i++)
      {
        if(type == "organization")
        {
          this.headerRow = ["שם", "פלאפון הקשיש" ,"שם איש קשר","פלאפון איש קשר" , "שם האירגון"]
          tmp[i] = [array[i].name, array[i].phoneE, array[i].assistName, array[i].phoneA, array[i].id]  
        }

        if(type == "eledry")
        {
          this.headerRow = ["שם", "פלאפון" , "כתובת", "שם איש קשר", "פלאפון איש קשר", "תאריך הרשמה"]
          tmp[i] = [array[i].name, array[i].phone, array[i].address, array[i].nameAssistant,
          array[i].contact, array[i].dateTime]  
        }

        if(type == "volunteer")
        {
          this.headerRow = ["שם", "פלאפון" , "כתובת", "תאריך הרשמה"]
          tmp[i] = [array[i].name, array[i].phone, array[i].address, array[i].dateTime]  
        }

        if(type == "student") {
          this.headerRow = ["שם" , "פלאפון", "תעודת זהות","מוסד אקדמי"]
          if(array[i].student){
            tmp[j] = [array[i].name, array[i].phone, array[i].id, array[i].college]
            j++}
        }
     
      }
    }

    let csv = papa.unparse({
      fields: this.headerRow,
      data: tmp
    });

    this.downloadCSV(csv , type)
  }


  //download excel file
  downloadCSV(csv, type)
  { 
    var blob = new Blob(["\ufeff", csv]);
    var a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(blob);
    if(type == "eledry")
      a.download = "דוח קשישים.csv";
    if(type == "student") 
      a.download = "דוח סטודנטים.csv";
    if(type == "organization")
      a.download = "דוח ארגונים.csv";
    if(type == "volunteer")
      a.download = "דוח מתנדבים.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 

  // modal for get 'more details' about the users
  async openPopover(event , uid, userType)
  {
    console.log("openPopover")
    let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType });
    popover.present({
      ev: event
    });
  }


  deleteMessage(item)
  {
      let alert = this.alertCtrl.create({
        title: 'אזהרה',
        subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את ההודעה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
              const db = firebase.firestore();
                    
              db.collection('message').doc(item).delete().then(() =>
              {
                this.event.publish('operateFunc', "1")    
                console.log("Document successfully deleted!");
               // this.alert.showAlert_deleteMessage()
            }).catch((error) => console.error("Error removing document: ", error));         
          }
        },
          {
            text: 'לא',
            handler: () => {
              console.log('no clicked');
            }
          }
        ]
      });
        alert.present();
  }



  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }



  deleteElderlyUser(item)
  {
   
    let alert = this.alertCtrl.create({
    title: 'אזהרה',
    subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את המשתמש?' ,
    buttons: [
    {
      text: 'כן',
      role: 'cancel',
      handler: () => {
          console.log('yes clicked');
          const db = firebase.firestore();

          db.collection("ElderlyUsers").doc(item).delete().then(() =>
          {
            this.event.publish('operateFunc', "1")    
            console.log("Document successfully deleted!")
          }).catch((error) => console.error("Error removing document: ", error)); 
        }
      },
      {
        text: 'לא',
        handler: () => {
          console.log('no clicked');
        }
      }
    ]
  });
    alert.present();
  }


  deleteVolunteerUser(item)
  {  
    let alert = this.alertCtrl.create({
    title: 'אזהרה',
    subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את המשתמש?' ,
    buttons: [
    {
      text: 'כן',
      role: 'cancel',
      handler: () => {
        console.log('yes clicked');
        const db = firebase.firestore();
              
        db.collection("volunteerUsers").doc(item).delete().then(() =>
        {
          this.event.publish('operateFunc', "1")    
          console.log("Document successfully deleted!");

        }).catch((error) => console.error("Error removing document: ", error));
      }
      },
      {
        text: 'לא',
        handler: () => {
          console.log('no clicked');
        }
      }
    ]
  });
    alert.present();
  }



  elderlyRadioClicked(numElderly)
  {
    this.matchE = this.userE[numElderly].docID;
    console.log("idE: ",this.matchE)
    this.userE[numElderly].manualM = true;

    for(var i = 0 ; i < this.userE.length; i++)
        if(numElderly != i)
          this.userE[i].manualM = false;
  }


  
  volunteerRadioClicked(numVolunteer)
  {
    this.matchV = this.userV[numVolunteer].docID
    console.log("idV: ",this.matchV)
    this.userV[numVolunteer].manualM= true;

    for(var i = 0 ; i <this.userV.length; i++)
        if(numVolunteer != i)
          this.userV[i].manualM = false;
  }


  //the method gets 2 date and return the deffrence between them
  DiffrenceDates(d1, d2)
  {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }


  // --------------------------------- Matching ----------------------------------------

  //the function check if there is allready exist match for this volunteer
  checkIfExistMacthVolunteer(numVolunteer)
  {
    console.log(numVolunteer)
    if (this.userV[numVolunteer].matching != "")
    {
      let alert = this.alertCtrl.create({
        title: 'למתנדב שבחרת כבר קיימת התאמה',
        subTitle: 'האם את/ה רוצה להגדיר לו התאמה חדשה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
            console.log('yes clicked');
            this.volunteerRadioClicked(numVolunteer)
          }
          },
          {
            text: 'לא',
            handler: () => {
              console.log('no clicked');
            }
          }
        ]
      });
        alert.present();
    }

    else
      this.volunteerRadioClicked(numVolunteer)
  }



  checkIfExistMacthElderly(numElderly)
  {
    console.log(numElderly)
    if (this.userE[numElderly].matching.id != "")
    {
      let alert = this.alertCtrl.create({
        title: 'לאזרח הותיק שבחרת כבר קיימת התאמה',
        subTitle: 'האם את/ה רוצה להגדיר לו התאמה חדשה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
            console.log('yes clicked');
            this.elderlyRadioClicked(numElderly)
          }
          },
          {
            text: 'לא',
            handler: () => {
              console.log('no clicked');
            }
          }
        ]
      });
        alert.present();
    }
    
    else
      this.elderlyRadioClicked(numElderly)

  }




  manual_matching()
  {
    const db = firebase.firestore();    

    if(this.matchE == null || this.matchV == null)
      this.alert.showError_manual_matching()

    else
    {
      db.collection("ElderlyUsers").doc(this.matchE).update({
          matching: {id: this.matchV, grade:"manual", date: this.date},
          status: 1
      }) .catch((error) => {console.log(error)})
      db.collection("volunteerUsers").doc(this.matchV).update({
          matching: this.matchE,
          status: 1
      }) 

      let indexE = 0, indexV = 0;
      for(var i = 0 ; i < this.userE.length; i++){
        if(this.userE[i].manualM){
          this.userE[i].matching = {id: this.matchV, grade: "manual" ,date: this.date},
          this.userE[i].manualM = false;
      
          indexE = i
          break }
      }
   
      for(var i = 0 ; i <this.userV.length; i++){
        if(this.userV[i].manualM){
          indexV = i
          this.userV[i].manualM = false
          break}
      }

      this.matchE, this.matchV = null;
     // this.sendEmailsVolunteer(this.userV[indexE].name, "chenfriedman93@gmail.com")
     // this.sendEmailsElder(this.userE[indexE].nameAssistant, this.userE[indexE].name, "chenfriedman93@gmail.com")
      //this.sendSMS(this.userV[indexE].phone, this.userV[indexE].name)
      this.alert.showSuccessManual()
    }
  }


//check if the volunteer do not reject this eldely
  findIfReject(arr , idE)
  {
    if(arr != null)
    {
      for(let i = 0 ; i < arr.length; i++){
        if(arr[i].id == idE)
          return true;}
    }
      return false;
  }



  matchingAlgorithm()
  {
    const db = firebase.firestore();
    for(let i = 0; i < this.userV.length; i++)
    {
      if(this.userV[i].status != 2 || this.userV[i].status != 4)
      {
        let arrMatch = [] , j = 0 
        this.findMatches(i, j , arrMatch)

        for(let k = 0; k < 3; k++) //save the best match
        {
          let diff = 0;
          if(!this.findIfReject(this.userV[i].matching ,arrMatch[k].id))
          {
            if(this.userE[arrMatch[k].index].matching.grade == "manual")
              diff = this.DiffrenceDates(this.userE[arrMatch[k].index].matching.date, this.date)

            //if the current grade is bigger than the last or if pass 30 days
            if(this.userE[arrMatch[k].index].matching.grade < arrMatch[k].grade || diff > 30)
            {
              this.userE[arrMatch[k].index].matching = {id: this.userV[i].docID, grade: arrMatch[k].grade ,
              date: this.date, nameV: this.userV[i].name, phoneV: this.userV[i].phone}
              console.log(this.userE[arrMatch[k].index].matching)
              break;
            }
          }
        }
      }
    }

    for(let k = 0; k < this.userE.length; k++) //update the best 'matching' in documents
    { 
      //if 'matching' is empty and no found match or matching is confirm - status
      if(this.userE[k].matching.id != "" && (this.userE[k].status != 2 || this.userE[k].status != 4 ))
      {
        console.log(this.userE[k].matching)
        let idV = this.userE[k].matching.id

          db.collection('ElderlyUsers').doc(this.userE[k].docID).update(
            {
              matching: this.userE[k].matching,
              status: 1
            }).catch((error) => {console.log(error)})
      
      
        db.collection('volunteerUsers').doc(idV).update(
        {
          matching: this.userE[k].docID
        }).catch((error) => {console.log(error)})
      }
    }

  
    for(let i = 0 ; i < this.userE.length; i++) //for sending emails and sms
    {
      if(this.userE[i].matching.id != "" && (this.userE[i].status != 2 || this.userE[i].status != 4 ))
      {
        this.sendEmailsVolunteer(this.userE[i].matching.nameV, "chenfriedman93@gmail.com")
        // if(this.userE[i].email != null)
        //   this.sendEmailsElder(this.userE[i].nameAssistant, this.userE[i].nameV, "chenfriedman93@gmail.com")
        //this.sendSMS(this.userE[i].matching.phoneV, this.userE[i].matching.name)
      }
    }

      this.alert.showSuccessAlgorithm();
  } 



  //the method find the 3 best matches for all volunteer and save it in 'arrMatch'
  findMatches(i, j , arrMatch)
  {
      for(let l = 0; l < this.userE.length; l++)
      {
        if(this.userE[l].status != 2 || this.userE[l].status != 4)
        {
          let grade = 0;
          if(this.userV[i].meetingWith == this.userE[l].meetingWith)
            grade +=1
          grade += this.checkMatchArr(this.userV[i].dayOfMeeting, this.userE[l].dayOfMeeting) //days
          //console.log("after days ", grade)
         // console.log("i: ", i ," l: ",l)
          grade += this.checkMatchArr(this.userV[i].hobbies, this.userE[l].hobbies) //hobbies
        // console.log("after hobbies ", grade)
          grade += this.checkMatchArr(this.userV[i].musicStyle, this.userE[l].musicStyle) //music style
         // console.log("after music style ", grade)
          grade += this.checkMatchArr(this.userV[i].hours, this.userE[l].hours) //hours
         // console.log("after hours ", grade)
          grade += this.checkMatchArr(this.userV[i].language, this.userE[l].language) //language
         // console.log("after language ", grade)
      
       // console.log("totle grade is: ", grade)
        let temp = {"grade": grade, "id": this.userE[l].docID, index: l}
        if(j < 3)
        {
          //insert temp to arrMatch with sorting way
          this.sortArr(arrMatch, j , temp , grade)
          j++;
        }
        else // check if the grade need to inserted to arrMatch
          this.update_gradesArr(arrMatch, grade, temp)
      }
    }
   // console.log("arrMatch :", arrMatch)
  }




   //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsVolunteer(username, email)
  {
    let text = "שלום "+ username +",\nרצינו לעדכן אותך שמצאנו לך התאמה :)\n" +
    "לפרטים נוספים לחץ/י על הקישור ובצע/י התחברות עם כתובת המייל והסיסמה שלך\n" +
    "לאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות' bit.ly/2WDBZTZ \n\n" +
    "תודה על שיתוף הפעולה,\n" +
    "שמחת שמחת זקנתי"

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
    let sendEmail = firebase.functions().httpsCallable('sendSms');
    sendEmail({number: number , name: name}).then(function(result) {
      console.log("success calling sendSms1 - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendSms1 functions - ", error.message ,error.code)
    });
  }



  //the method check if the volunteer and the eldery chose the same options in the form
  checkMatchArr(arrV, arrE)
  {
    let grade = 0
      for(let i = 0 ; i < arrV.length; i++)
      {
        if(arrV[i].currentValue && arrE[i].currentValue)
          grade+= 1
      }
    return grade;
  }


  //insert new grade to array in sort way
  update_gradesArr(arr, grade, temp)
  {
      if(grade >= arr[0].grade)
      {
        arr[2] = arr[1]
        arr[1] = arr[0]
        arr[0] = temp
      }
      else if(grade <= arr[1].grade && grade >= arr[2].grade)
      arr[2] = temp

      else if(grade < arr[0].grade && grade >= arr[1].grade)
      {
        arr[2] = arr[1]
        arr[1] = temp
      }
      return arr
  }


  // The method puts the first three grades in an sort way
  sortArr(arrMatch, j , temp , grade)
  {
    if(j == 0)
      arrMatch[0] = temp

    else if(j == 1)
    {
      if(grade > arrMatch[0].grade)
      {
        arrMatch[1] = arrMatch[0]
        arrMatch[0] = temp
      }
      else if(grade <= arrMatch[0].grade)
        arrMatch[1] = temp
    }

    else if (j == 2)
    {
      if(grade >= arrMatch[0].grade)
      {
        arrMatch[2] = arrMatch[1]
        arrMatch[1] = arrMatch[0]
        arrMatch[0] = temp
      }
      else if(grade < arrMatch[0].grade && grade >= arrMatch[1].grade)
      {
        arrMatch[2] = arrMatch[1]
        arrMatch[1] = temp
      }
      else 
        arrMatch[2] = temp
    }
  }
  
}