import { NavController,NavParams, AlertController, PopoverController} from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import {Functions} from '../../providers/functions';
import { PopoverPage } from '../popover/popover';
import { EmailValidator } from '@angular/forms';

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
  public matchPeople: any[]
  public matchE: any;
  public matchV: any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController , public alert: AlertProvider, public func: Functions , public popoverCtrl: PopoverController) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.userStudent = this.navParams.get('students');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');
 
    console.log(this.userE)
    console.log(this.userV)
  }


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

    console.log(tmp)

    let csv = papa.unparse({
      fields: this.headerRow,
      data: tmp
    });

    this.downloadCSV(csv , type)
  }


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
    let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType });
    popover.present({
      ev: event
    });
  }


  deleteMessage(item)
  {
      const db = firebase.firestore();
      let message =[] ,l = 0 
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


  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }


  add_AdminUser()
  {
    this.navCtrl.push(RegisterPage,{'login': this.user.loggedIn , 'admin': this.user.Admin}); 
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

    for(var i=0 ; i < this.userE.length; i++)
        if(numElderly != i)
          this.userE[i][8] = false;

    // console.log("idEled ",this.matchE)
    // console.log(this.userE)
  }


  
  volunteerRadioClicked(numVolunteer)
  {
    this.matchV = this.userV[numVolunteer][4]; 
    this.userV[numVolunteer][6] = true;

    for(var i=0 ; i <this.userV.length; i++)
        if(numVolunteer != i)
          this.userV[i][6] = false;

    // console.log("idVol ",this.matchV)
    // console.log(this.userV)
  }


  // --------------------------------- Matching ----------------------------------------


  manual_matching()
  {
   this.matchPeople = [this.matchE ,this.matchV]
   const db = firebase.firestore();    
   
   db.collection("ElderlyUsers").doc(this.matchE).update({
      match: this.matchV
   }) 
   db.collection("ElderlyUsers").doc(this.matchV).update({
      match: this.matchE
   }) 
    
   this.matchE = null;
   this.matchV = null;

   for(var i=0 ; i<this.userE.length; i++)
      this.userE[i][8] = false;

   for(var i=0 ; i<this.userV.length; i++)
      this.userV[i][6] = false;


  //  console.log(this.matchPeople)   
  //  console.log(this.matchE)
  //  console.log(this.matchV)
  }



  //the method find the matches for all voolunteer and save it in 'arrMatch'
  findMatches()
  {
    const db = firebase.firestore();
    for(let i = 0; i < this.userV.length; i++)
    {
      let arrMatch = [] , j = 0 
      for(let l = 0; l < this.userE.length; l++)
      {
        let grade = 0;
        if(this.userV[i][13] == this.userE[l][15])
          grade +=1
        grade += this.checkMatchArr(this.userV[i][8], this.userE[l][10]) //days
       // console.log("after days ", grade)
        grade += this.checkMatchArr(this.userV[i][9], this.userE[l][11]) //hobbies
       // console.log("after hobbies ", grade)
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

    //   console.log(arrMatch)
    this.matchingAlgorithm(arrMatch, db ,i)    
    }

    // console.log(this.userE)
    for(let i = 0 ; i < this.userE.length; i++)
    {
      if(this.userE[i][16] != null)
      {
        this.sendEmailsVoolunteer(this.userE[i][16][2], "chenfriedman93@gmail.com")
        //if(this.userE[i][17] != null)
        this.sendEmailsElder(this.userE[i][3], this.userE[i][0], "chenfriedman93@gmail.com")
      }
    }
  } 



   //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsVoolunteer(username, email)
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

    let text = "שלום "+ username +",\nרצינו לעדכן אותך שנמצאה התאמה עבור אזרח ותיק שרשמת באתר שלנו - " +nameE +"\n"+
    "בימים הקרובים יצרו עמכם קשר\n\n"+
    "בברכה,\n"+
    "צוות שמחת זקנתי"

    let subject =  "נמצאה התאמה באתר שמחת זקנתי!"

    let sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail({email: email, subject: subject, text: text}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendEmail functions - ", error.message ,error.code)
    });
  }



  //this code is call sendSms (firebase Functions) from backend
  sendSMS(name)
  {
    let sendEmail = firebase.functions().httpsCallable('sendSms');
    sendEmail({name: name}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendSms functions - ", error.message ,error.code)
    });
  }


  //the method saved the match in 'matching' fileld in elderly and voolunteer document
  matchingAlgorithm(arrMatch, db ,i)
  {
    for(let k = 0; k < 3; k++)
    {
      if(this.userE[arrMatch[k].index][16][1] < arrMatch[k].grade)
      {
        let elderID = arrMatch[k].id
        console.log(this.userV[i][0])
        this.userE[arrMatch[k].index][16] = [this.userV[i][4], arrMatch[k].grade, this.userV[i][0]]

        db.collection('ElderlyUsers').doc(elderID).update(
          {
            matching:[this.userV[i][4], arrMatch[k].grade] 
          }).catch((error) => {console.log(error)})
    
    
        db.collection('volunteerUsers').doc(this.userV[i][4]).update(
          {
            arrMatch: arrMatch,
            matching: elderID
          }).catch((error) => {console.log(error)})
        break;
      }
    }
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