import { Component } from '@angular/core';
import { AlertController ,NavController} from 'ionic-angular';
import { User } from '../../module/User'
<<<<<<< HEAD
import 'firebase/firestore';
import firebase, { firestore } from 'firebase';
import { HomePage } from '../home/home';
=======
//import 'firebase/firestore';
//import firebase, { firestore } from 'firebase';
//import { HomePage } from '../home/home';
>>>>>>> 1e874e360c6ff8352f956b2f25190340ddc5bb0d


@Component({
  selector: 'page-form',
  templateUrl: 'form.html' ,
})

export class Form
 {
    user = {} as User;
    public hobbies: any[] 
    
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController,
   ) 
  {
    this.user.onBehalf = false;
    this.user.nameAssistant = null;
    this.user.relationship = null;

    this.hobbies = [
      {
          'species' : 'music',
          'currentValue' : false
      },{
          'species' : 'chess',
          'currentValue' : false
      },{
          'species' : 'backgammon',
          'currentValue' : false
      },{
          'species' : 'checkers',
          'currentValue' : false
      },{
          'species' : 'talk',
          'currentValue' : false
      },{
          'species' : 'dance',
          'currentValue' : false
      },{
        'species' : 'magic',
        'currentValue' : false
      }
    ];

    this.get_data_from_firebase();
 
  }
 
  showAlertSuccess()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: '!הפרטים נשמרו בהצלחה',
      buttons: ['OK']
    });
    alert.present();
  }


  showAlertError()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא את כל השדות',
      buttons: ['OK']
    });
    alert.present();
  }


  //check all user inputs are legal
  check_field_value()
  {
    if(typeof( this.user.fullName) === "undefined" || typeof( this.user.email) === "undefined" ||
    typeof( this.user.phone) === "undefined" || typeof( this.user.address) === "undefined")
      this.showAlertError();
      else
         this.add_data_to_firebase();
  }


  //update the variables if someone fill the form behalf elderly
  onbehalf()
  {
    if(this.user.onBehalf === false)
      this.user.onBehalf = true;
    else
    {
      this.user.onBehalf = false;
      this.user.nameAssistant = null;
      this.user.relationship = null;
    }
  }


  //check which checkbox was clicked and update the array
  CheckboxClicked(item: any, $event)
  {
    console.log('CheckboxClicked for ' + item.species);
    for(let i = 0 ; i< this.hobbies.length ; i++)
    {
      
      if(this.hobbies[i] === item)
        this.hobbies[i] ={
          'species' : item.species,
          'currentValue' : !item.currentValue
        };
    }
  }

  
   add_data_to_firebase()
  {
    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).set(
      {
        fullName: this.user.fullName,
        address: this.user.address,
        phone: this.user.phone,
        email: this.user.email,
        behalf: this.user.onBehalf,
        nameAssistant: this.user.nameAssistant,
        relationship: this.user.relationship,
        hobbies: this.hobbies,
      })
      .then(() => {
        this.showAlertSuccess();
        this.navCtrl.push(HomePage);
      }).catch((error)=> {
        console.log })
  }


    get_data_from_firebase()
  {
    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
    .then(result =>{
      if (!result.exists) return
        this.user.fullName = result.data().fullName;
        this.user.address = result.data().address;
        this.user.phone = result.data().phone
        this.user.email = result.data().email
        this.user.onBehalf = result.data().behalf
        this.user.nameAssistant = result.data().nameAssistant
        this.user.relationship = result.data().relationship
        this.hobbies = result.data().hobbies
        
    })
  }


}
