import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams, AlertController} from 'ionic-angular';
import { contactMessage } from '../../module/contactMessage'
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { RegisterPage } from '../register/register';
import firebase, { firestore } from 'firebase';
//import * as admin from 'firebase-admin';

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  user = {} as User
  userE = {} as User;
  userV = {} as User;
  messages = {} as contactMessage;
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http ,public alertCtrl: AlertController) 
  {
    this.user.loggedIn = this.navParams.get('login');
    this.userE = this.navParams.get('elderly');
    this.user.Admin = this.navParams.get('admin');
    this.userV = this.navParams.get('volunteer');

    let temp = [["1","2"],["2","3"],["4","5"],["6","7"]]
    this.extractData(temp)
    this.messages = this.navParams.get('messages');

    console.log(this.messages)
    console.log(this.userE )
    console.log( this.userV)
    //this.setArray()
  //  this.readCsvData();
  }

  private readCsvData() {
    this.http.get( 'assets/test.csv')
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }
 
  private extractData(res) {
    let csvData =  res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.headerRow = parsedData[0]
    this.headerRow = ["name", "phone" , "adrress"]
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
 
  downloadCSV() {
    //let temp = [["1","2"],["2","3"],["4","5"],["6","7"]]
    let tmp= []
    for(let i = 0 ; i < 2 ; i++)
    {
      tmp[i] = this.userE[i]
    }

    let csv = papa.unparse({
      fields: this.headerRow,
      data: tmp
       });
 
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
 
  

  deleteMessage(item)
  {
    console.log(item)
      const db = firebase.firestore();
      let deleteDoc = db.collection('message').doc(item).delete().then(function() {
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

            let deleteDoc = db.collection(str).doc(item).delete().then(function() {
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

}