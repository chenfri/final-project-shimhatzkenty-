import { Injectable } from '@angular/core';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { User } from '../module/user'
import {AlertProvider} from './alert/alert'
import firebase, { firestore } from 'firebase';
@Injectable()
export class Functions
{


    user = {} as User;
    organization : any
    public organizations: any[]
  constructor(public alertCtrl: AlertController, public alert: AlertProvider) {
  }


  CheckWhichOrganization(id)
  {
    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc(id).get()
    .then(result => {
      if (!result.exists) return
      this.organizations = result.data().organization;
        
      for (let i = 0; i < this.organizations.length; i++) {
          if(this.organizations[i].currentValue){
            // console.log("organization.currentValue :  " + this.organizations[i].species)
            // return this.organizations[i].species;
            this.organization = this.organizations[i].species;
            console.log("organization.func :  " + this.organization)

          }
      }    
      })
  
  }


  async registry(email, password)
  {
    console.log(email)
    console.log(password)
    if (email == "undefined" || password == "undefined")
      this.alert.error_emptyEmailOrPassword();
    else
    {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (res)
          { //firebase.auth().currentUser.sendEmailVerification()
          return "sucsses"}
          
      }
      catch (e) {
        console.error(e);
        if (e.message == "The email address is already in use by another account.")
          this.alert.error_emailIsAllreadyExist();
        else
          this.alert.error_illegalEmailOrPassword();
      }
    }
}

}
