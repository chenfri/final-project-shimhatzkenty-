import { NavController,NavParams, AlertController} from 'ionic-angular';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import firebase, { firestore } from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { contactMessage } from '../../module/contactMessage'
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
{
  user = {} as User
  userE = {} as User;
  userV = {} as User;
  userStudent = {} as User;
  organizationEledry = {} as User;

  organizationNum: any
  elderNum: any
  volunteerNum: any
  studentNum: any;
  messages : any[]
  csvData: any[] = [];
  headerRow: any[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController , public alert: AlertProvider) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.userStudent = this.navParams.get('students');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');

    this.organizationNum = this.navParams.get('organizationNum')
    this.elderNum = this.navParams.get('elderNum');
    this.volunteerNum = this.navParams.get('volunteerNum');
    this.studentNum = this.navParams.get('studentNum');

  }


  csvFile(array , lengthArray , type)
  {
      let tmp= []
      for(let i = 0 ; i < lengthArray ; i++)
        tmp[i] = array[i]
    
      if(type == "eledry" || type == "volunteer")
        this.headerRow = ["שם", "פלאפון" , "כתובת"]
      if(type == "student") 
        this.headerRow = ["שם" , "פלאפון", "תעודת זהות"]
      if(type == "organization")
        this.headerRow = ["שם", "פלאפון הקשיש" ,"פלאפון איש הקשר" , "שם האירגון"]

      console.log("tmp: " + tmp)

      let csv = papa.unparse({
        fields: this.headerRow,
        data: tmp
      });

      this.downloadCSV(csv)
  }


  downloadCSV(csv)
  { 
    var blob = new Blob(["\ufeff", csv]);
    var a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 

  deleteMessage(item)
  {
      const db = firebase.firestore();
      db.collection('message').doc(item).delete().then(() =>{
        this.alert.showAlert_deleteMessage()
        console.log("Document successfully deleted!");
        
      let message =[]
        var l = 0 
          
    db.collection('message').get().then(res => {res.forEach(i =>{message[l]={
      data: i.data() ,
      id : i.id }
      l++})}).catch(error => {console.log(error)})
      this.messages = message
      console.log(this.messages)
    

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }


  deleteElderlyUser(item)
  {
    this.deleteUserFromFirebase(item, 'ElderlyUsers')
  }
  

  deleteVolunteerUser(item)
  {
    this.deleteUserFromFirebase(item, 'volunteerUsers')
  }
 

  deleteUserFromFirebase(item, str)
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
              
            let deleteUser = db.collection(str).doc(item).delete().then(function() {
              console.log("Document successfully deleted!");

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
    this.navCtrl.push(HomePage , {'login': this.user.loggedIn,  'admin': this.user.Admin});
  }

  add_AdminUser()
  {
    this.navCtrl.push(RegisterPage, {'login': this.user.loggedIn, 'admin': this.user.Admin});
  }


}