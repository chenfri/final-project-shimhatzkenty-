import { NavController,NavParams, AlertController} from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import {Functions} from '../../providers/functions'

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
{
  user = {} as User
  organizationNum: any
  organizationName: any;
  elderNum: any
  volunteerNum: any
  studentNum: any
  userE : any[]
  userV : any[]
  userStudent : any[]
  organizationEledry : any[]
  messages : any[]
  csvData: any[] = []
  headerRow: any[] = []
  public organizations: any[]

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController , public alert: AlertProvider, public func: Functions) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    console.log("userE ", this.userE)
    this.userV = this.navParams.get('volunteer');
    console.log("volunteer ", this.userV)
    this.userStudent = this.navParams.get('students');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');
    // this.user.dateTime = this.navParams.get('dateTime');

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
        this.headerRow = ["שם", "פלאפון" , "כתובת","תאריך הרשמה"]
      if(type == "student") 
        this.headerRow = ["שם" , "פלאפון", "תעודת זהות","תאריך הרשמה"]
      if(type == "organization")
        this.headerRow = ["שם", "פלאפון הקשיש" ,"פלאפון איש הקשר" , "שם האירגון"]

      console.log("tmp: " + tmp)

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
 

  deleteMessage(item)
  {
      const db = firebase.firestore();
      let message =[] ,l = 0 
      db.collection('message').doc(item).delete().then(() =>{
        this.alert.showAlert_deleteMessage()
        console.log("Document successfully deleted!");
        
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
 

  deleteUserFromFirebase(item, collectionName)
  {

    let array = [] ,student = [], orgs = [], k = 0 , j = 0  , l = 0     
    const db = firebase.firestore();
    
    let alert = this.alertCtrl.create({
      title: 'אזהרה',
      subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את המשתמש?' ,
      buttons: [
        {
          text: 'לא',
          handler: () => {
            console.log('no clicked');
          }
        },
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
                if(i.data().student == true) //if student
                {
                  console.log("a")
                  student[j] =
                  [ i.data().fullName,
                    i.data().phone,
                    i.data().id,
                    i.id
                  ]
                  j++;
                } 

                else if(i.data().behalf == true ) //if organization
                {
                  console.log("b")
                  this.CheckWhichOrganization(i.id);
                  
                  setTimeout(() =>
                  {     
                    console.log("organization:  " + this.organization)
                    if(this.organization != null)
                    {
                      orgs[l] = 
                      [
                        i.data().fullName,
                        i.data().phone,
                        i.data().contact,
                        this.organization,
                        i.id,
                      ]
                      l++;
                    }
                  }, 500); 
                }
                 array[k] = // regular details
                [ i.data().fullName,
                  i.data().phone,
                  i.data().address,
                  i.id]
                  k++})}).catch(error => {console.log(error)})


            }).catch(function(error) {
              console.error("Error removing document: ", error);
            });
            
            console.log(array)

            if(collectionName === 'ElderlyUsers')
            {
              this.userE = array
              if(orgs != undefined || orgs != null)
              {
                console.log("orgs ",orgs)
                this.organizationEledry = orgs
              }
            }
            else
            {
              this.userV = array
              if(student != undefined || student != null)
              {
                console.log("student " ,student)
                this.userStudent = student
              }
            }    
          }
        }
      ]
    });
    alert.present();
  }



  CheckWhichOrganization(id)
  {
    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc(id).get()
    .then(result => {
      if (!result.exists) return
      this.organizations = result.data().organization;
        
      for (let i = 0; i < this.organizations.length; i++) {
            this.organizationName = this.organizations[i].species;
            console.log("organization.func :  " + this.organizationName)

          }
      }    
      )
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