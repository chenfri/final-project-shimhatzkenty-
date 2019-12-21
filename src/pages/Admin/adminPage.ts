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
//import * as admin from 'firebase-admin';
//import * as functions from 'firebase-functions';


@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  user = {} as User
  userE = {} as User;
  userV = {} as User;
  elderNum: any
  volunteerNum: any
  messages = {} as contactMessage;
  csvData: any[] = [];
  headerRow: any[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
     private http: Http ,public alertCtrl: AlertController , public alert: AlertProvider) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.messages = this.navParams.get('messages');
    this.elderNum = this.navParams.get('elderNum');
    this.volunteerNum = this.navParams.get('volunteerNum');
    this.headerRow = ["שם", "פלאפון" , "כתובת"]

    console.log(this.messages)
    console.log(this.userE )
    console.log(this.userV)
    console.log("volunteerNum: " +this.volunteerNum)
    console.log("elderNum: " +this.elderNum)
  }

 

  // private extractData(res)
  // {
  //   let csvData =  res['_body'] || '';
  //   let parsedData = papa.parse(csvData).data;
  //   this.headerRow = parsedData[0]
  //   this.headerRow = ["שם", "פלאפון" , "כתובת"]
  //   parsedData.splice(0, 1);
  //   this.csvData = parsedData;
  // }

  csvFileElderly(){
      let tmp= []
          for(let i = 0 ; i < this.elderNum ; i++)
          {
            tmp[i] = this.userE[i]
          }

          let csv = papa.unparse({
          fields: this.headerRow,
          data: tmp
          });

          this.downloadCSV(csv)
  }

  csvFileVolunteer(){
    let tmp= []
        for(let i = 0 ; i < this.volunteerNum ; i++)
        {
          tmp[i] = this.userV[i]
        }

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
              /*admin.auth().deleteUser(item)
              .then(function() {
                console.log('Successfully deleted user');
              })
              .catch(function(error) {
                console.log('Error deleting user:', error);
              });*/
              // var user = firebase.auth().currentUser;

              // user.delete().then(function() {
              //   // User deleted.
              // }, function(error) {
              //   // An error happened.
              // });
          //   let deleteDoc = db.collection(str).doc(item).delete().then(function() {
          //     console.log("Document successfully deleted!");
          // }).catch(function(error) {
          //     console.error("Error removing document: ", error);
          // });
          firebase.auth().signInWithEmailAndPassword("yarden@admin.com", "123456")
          .then(function (info) {
             var user = firebase.database().ref(item).remove;
             
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

  click_manageUser()
  {
    this.navCtrl.push(RegisterPage, {'login': this.user.loggedIn, 'admin': this.user.Admin});
  }

  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }

}