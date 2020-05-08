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
    //console.log('uid: ',uid)
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

}