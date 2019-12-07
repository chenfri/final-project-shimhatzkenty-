import { Component } from '@angular/core';
import { contactMessage } from '../../module/contactMessage'
import firebase from 'firebase';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'contact-page',
  templateUrl: 'contactPage.html' ,
})

export class contactPage
 {
  contactMessage = {} as contactMessage;
  

  constructor(public alertCtrl: AlertController,public navCtrl: NavController , public params: NavParams){

  }

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
