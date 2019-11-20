import { Component } from '@angular/core';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import firebase, { firestore } from 'firebase';

@Component({
  selector: 'page-form',
  templateUrl: 'form.html' ,
})

export class Form
{
    user = {} as User;
    public hobbies: any[] 
    
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController, public params: NavParams) 
  {
    console.log("if elderly:")
    this.user.elderly = this.params.get('elderly');
    console.log(this.user.elderly)

    console.log("if logged in")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    this.user.onBehalf = false;
    this.user.nameAssistant = null;
    this.user.relationship = null;

    this.hobbies = [
      {
          'species' : 'מוסיקה',
          'currentValue' : false
      },{
          'species' : 'שחמט',
          'currentValue' : false
      },{
          'species' : 'ששבש',
          'currentValue' : false
      },{
          'species' : 'דמקה',
          'currentValue' : false
      },{
          'species' : 'דיבור',
          'currentValue' : false
      },{
          'species' : 'ריקוד',
          'currentValue' : false
      },{
        'species' : 'קסמים',
        'currentValue' : false
      }
    ];

    if(this.user.loggedIn)
      this.get_data_from_firebase();
  }


 async registry()
  {
    if(this.user.email == "" ||this.user.password == "")
       this.showAlertError2();
    try{
      const res = await firebase.auth().createUserWithEmailAndPassword
      (this.user.email, this.user.password);
      if(res)
        this.showAlert();
    }
    catch(e)
    {
      this.showAlertError3();
      console.error(e);
    }
  }


  //if the user want to change his user to password 
  update_email_or_password()
  {
    firebase.auth().currentUser.updatePassword(this.user.password);
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.navCtrl.push(HomePage);
  }

  
  //check all user inputs are legal
  check_field_value()
  {
    if(typeof( this.user.fullName) === "undefined"  ||typeof( this.user.phone) === "undefined" 
    || typeof( this.user.address) === "undefined")
      this.showAlertError();
      else
      {
        if(this.user.elderly)
          this.add_data_to_firebase_Elderly();
        else
          this.add_data_to_firebase_Volunteer();
      }
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
    //console.log('CheckboxClicked for ' + item.species);
    for(let i = 0 ; i< this.hobbies.length ; i++)
    {
      
      if(this.hobbies[i] === item)
        this.hobbies[i] ={
          'species' : item.species,
          'currentValue' : !item.currentValue
        };
    }
  }


  add_data_to_firebase_Volunteer()
  {
    const db = firebase.firestore();
    db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).set(
      {
        fullName: this.user.fullName,
        address: this.user.address,
        phone: this.user.phone,
        email: this.user.email,
        hobbies: this.hobbies,
      })
      .then(() => {
        this.showAlertSuccess();
        this.navCtrl.push(HomePage);
      }).catch((error)=> {
        console.log })
  }
  

  add_data_to_firebase_Elderly()
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

    if(this.user.elderly)
    {
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
    else
    {
      db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
      .then(result =>{
        if (!result.exists) return
          this.user.fullName = result.data().fullName;
          this.user.address = result.data().address;
          this.user.phone = result.data().phone
          this.user.email = result.data().email
          this.hobbies = result.data().hobbies
       })
    }
  }


 //---------- diffrent methods for errors ---------------
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

  
  showAlertError2()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא כתובת דוא"ל וסיסמא',
      buttons: ['OK']
    });
    alert.present();
  }


  showAlertError3()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com <br> וסיסמא באורך של 6 תווים לפחות',
      buttons: ['OK']
    });
    alert.present();
  }


  showAlert()
  {
    let alert = this.alertCtrl.create({
      title: '!הפרטים נשמרו בהצלחה',
      subTitle: 'שים לב, יש למלא את כל הטופס' ,
      buttons: ['OK']
    });
    alert.present();
  }

}
