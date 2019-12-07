import { Component } from '@angular/core';
<<<<<<< HEAD
//import { EmailComposer } from '@ionic-native/email-composer/ngx';
=======
import { contactMessage } from '../../module/contactMessage'
import firebase from 'firebase';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { HomePage } from '../home/home';
>>>>>>> d2177398e5d7d973543d8eb668fe23200b191fad


@Component({
  selector: 'contact-page',
  templateUrl: 'contactPage.html' ,
})

export class contactPage
 {
<<<<<<< HEAD
 
  constructor(){
=======
  contactMessage = {} as contactMessage;
  

  constructor(public alertCtrl: AlertController,public navCtrl: NavController , public params: NavParams){

  }
>>>>>>> d2177398e5d7d973543d8eb668fe23200b191fad

  add_data_to_firebase()
  {
    const db = firebase.firestore();
    db.collection('message').doc().set(
      {
        fullName: this.contactMessage.fullName,
        phoneNumber: this.contactMessage.phoneNumber,
        message: this.contactMessage.message,
      
      })
      .then(() => {
        this.showAlertSuccess();
        this.navCtrl.push(HomePage);
      }).catch((error)=> {
        console.log })
  }

  showAlertSuccess()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!ההודעה נשלחה בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }
  
  
}
