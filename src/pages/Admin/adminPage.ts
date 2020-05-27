import { NavController,NavParams, AlertController, PopoverController} from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import {Functions} from '../../providers/functions';
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
  userStudent : any[]
  organizationEledry : any[]
  messages : any[]
  csvData: any[] = []
  headerRow: any[] = []
  public organizations: any[]
  public matchE: any;
  public matchV: any;
  public date: any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController ,
     public alert: AlertProvider, public func: Functions , public popoverCtrl: PopoverController) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.userStudent = this.navParams.get('students');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');

    this.matchE = null;
    this.matchV = null;
    this.date = new Date().toISOString().substring(0, 10);
    this.DiffrenceDates("2020-05-24" , "2020-06-23")
    console.log(this.userE)
    console.log(this.userV)
    //this.sendSMS("+972508591865", "חן")
  }


  //create excel file with the rellevant data
  csvFile(array , type , arrType)
  {
    let tmp= []

    if(array != null || array != undefined)
    {
      for(let i = 0 ; i < array.length ; i++)
      {
        if(arrType)
          tmp[i] = [array[i].name, array[i].phoneE, array[i].assistName, array[i].phoneA, array[i].id]  
        else  
          tmp[i] = array[i]
      }
    }

    if(type == "eledry")
      this.headerRow = ["שם", "פלאפון" , "כתובת", "שם איש קשר", "פלאפון איש קשר", "תאריך הרשמה"]
    if(type == "volunteer")
      this.headerRow = ["שם", "פלאפון" , "כתובת", "תאריך הרשמה"]
    if(type == "student") 
      this.headerRow = ["שם" , "פלאפון", "תעודת זהות","מוסד אקדמי"]
    if(type == "organization")
      this.headerRow = ["שם", "פלאפון הקשיש" ,"שם איש קשר","פלאפון איש קשר" , "שם האירגון"]

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
      const db = firebase.firestore();
      let message =[] ,l = 0 


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
            this.alert.showAlert_deleteMessage()
            console.log("Document successfully deleted!");
            
            db.collection('message').get().then(res => {res.forEach(i =>{message[l] = {
              data: i.data() ,
              id : i.id }
              l++})}).catch(error => {console.log(error)})
              this.messages = message
              console.log(this.messages)
          
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
                   
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
    this.deleteUserFromFirebase(item, 'ElderlyUsers')
  }


  deleteVolunteerUser(item)
  {
    this.deleteUserFromFirebase(item, 'volunteerUsers')
  }
 

  deleteUserFromFirebase(item, collectionName)
  {
    let array = [] ,student = [], orgs = [], k = 0 , j = 0  , l = 0     
    const db = firebase.firestore();
    
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
            
      db.collection(collectionName).doc(item).delete().then(function()
      {
        console.log("Document successfully deleted!");

        db.collection(collectionName).get().then(res => { res.forEach(i => {
        if(i.data().student == true) //get all students document
        {
          student[j] =
          [ i.data().fullName,
            i.data().phone,
              i.data().id,
              i.data().college,
              i.data().dateTime,
              i.id ]
            j++;
        } 
            array[k] = // get all volunteer users document
            [  i.data().fullName,
              i.data().phone,
              i.data().address,
              i.data().dateTime,
              i.id]
            k++})}).catch(error => {console.log(error)})


      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
          
      this.userV = array
      if(student != undefined || student != null)
        this.userStudent = student          
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
    this.matchE = this.userE[numElderly][6];
    this.userE[numElderly][8] = true;

    for(var i = 0 ; i < this.userE.length; i++)
        if(numElderly != i)
          this.userE[i][8] = false;
  }


  
  volunteerRadioClicked(numVolunteer)
  {
    this.matchV = this.userV[numVolunteer][4]
    this.userV[numVolunteer][6] = true;

    for(var i=0 ; i <this.userV.length; i++)
        if(numVolunteer != i)
          this.userV[i][6] = false;
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


  manual_matching()
  {
    const db = firebase.firestore();    
   
    if(this.matchE == null || this.matchV == null)
      this.alert.showError_manual_matching()

    else
    {
      db.collection("ElderlyUsers").doc(this.matchE).update({
          matching: [this.matchV, "manual", this.date]
      }) .catch((error) => {console.log(error)})
      db.collection("volunteerUsers").doc(this.matchV).update({
          matching: [this.matchE],
          status: 1
      }) 

      let indexE, indexV = 0;

      for(var i = 0 ; i < this.userE.length; i++){
        if(this.userE[i][8]){
          this.userE[i][16] = [this.matchV, "manual" ,this.date]
          this.userE[i][8] = false;
      
          indexE = i
          break}
      }
   
      for(var i = 0 ; i <this.userV.length; i++){
        if(this.userV[i][6]){
          indexV = i
          this.userV[i][6] = false
          break}
      }

      this.matchE, this.matchV = null;
     // this.sendEmailsVolunteer(this.userV[indexE][0], "chenfriedman93@gmail.com")
     // this.sendEmailsElder(this.userE[indexE][3], this.userE[indexE][0], "chenfriedman93@gmail.com")
      //this.sendSMS(this.userV[indexE][1], this.userV[indexE][0])
      this.alert.showSuccessAlgorithm()
    }
  }



  matchingAlgorithm()
  {
    const db = firebase.firestore();
    for(let i = 0; i < this.userV.length; i++)
    {
      let arrMatch = [] , j = 0 
      this.findMatches(i, j , arrMatch)

      for(let k = 0; k < 3; k++) //save the best match
      {
        let diff = 0;
        if(this.userE[arrMatch[k].index][16][1] == "manual")
          diff = this.DiffrenceDates(this.userE[arrMatch[k].index][16][2], this.date)

        //if the current grade is bigger than the last or if pass 30 days
        if(this.userE[arrMatch[k].index][16][1] < arrMatch[k].grade || diff > 30)
        {
          this.userE[arrMatch[k].index][16] = [this.userV[i][4], arrMatch[k].grade , this.userV[i][0], this.userV[i][1]]
          console.log( this.userE[arrMatch[k].index][16])
          break;
        }
      }
    }

    for(let k = 0; k < this.userE.length; k++) //update the best 'matching' in documents
    {
      if(this.userE[k][16][0] != "") //if 'matching' is empty and no found match
      {
        console.log(this.userE[k][16])
        let idV = this.userE[k][16][0]

          db.collection('ElderlyUsers').doc(this.userE[k][6]).update(
            {
              matching:[this.userE[k][16][0], this.userE[k][16][1]] 
            }).catch((error) => {console.log(error)})
      
      
        db.collection('volunteerUsers').doc(idV).update(
        {
          matching: this.userE[k][6]
        }).catch((error) => {console.log(error)})
      }
    }

  
    // for(let i = 0 ; i < this.userE.length; i++) //for sending emails and sms
    // {
    //   if(this.userE[k][16][0] != "")
    //   {
    //     this.sendEmailsVolunteer(this.userE[i][16][2], "chenfriedman93@gmail.com")
    //     //if(this.userE[i][17] != null)
    //     this.sendEmailsElder(this.userE[i][3], this.userE[i][0], "chenfriedman93@gmail.com")
    //     //this.sendSMS(this.userE[i][16][3], this.userE[i][16][2])
    //   }
    // }

      this.alert.showSuccessAlgorithm();
  } 



  //the method find the 3 best matches for all volunteer and save it in 'arrMatch'
  findMatches(i, j , arrMatch)
  {
      for(let l = 0; l < this.userE.length; l++)
      {
        let grade = 0;
        if(this.userV[i][13] == this.userE[l][15])
          grade +=1
        grade += this.checkMatchArr(this.userV[i][8], this.userE[l][10]) //days
      // console.log("after days ", grade)
        grade += this.checkMatchArr(this.userV[i][9], this.userE[l][11]) //hobbies
      // console.log("after hobbies ", grade)
        grade += this.checkMatchArr(this.userV[i][12], this.userE[l][14]) //music style
        grade += this.checkMatchArr(this.userV[i][10], this.userE[l][12]) //hours
    //   console.log("after hours ", grade)
        grade += this.checkMatchArr(this.userV[i][11], this.userE[l][13]) //language
      //  console.log("after language ", grade)
        grade += this.checkMatchArr(this.userV[i][12], this.userE[l][14]) //musicStyle

  //   console.log("totle grade is: ", grade)
      let temp = {"grade": grade, "id": this.userE[l][6], index: l}
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




   //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsVolunteer(username, email)
  {
    let text = "שלום "+ username +",\nרצינו לעדכן אותך שמצאנו לך התאמה :)\n" +
    "לפרטים נוספים לחץ/י על הקישור ובצע/י התחברות עם כתובת המייל והסיסמה שלך\n" +
    "bit.ly/2WDBZTZ\n\n" +
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

    let text = "שלום "+ username +",\n";
    if(username != nameE)
      text +="רצינו לעדכן אותך שנמצאה התאמה עבור אזרח ותיק שרשמת באתר שלנו - " +nameE +"\n"+
      "בימים הקרובים יצרו עמכם קשר\n\n"
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