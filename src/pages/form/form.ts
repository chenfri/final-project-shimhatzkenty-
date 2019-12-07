import { Component } from '@angular/core';
import { AlertController ,NavController,NavParams} from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import firebase, { firestore } from 'firebase';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'page-form',
  templateUrl: 'form.html' ,
})

export class Form
{
    user = {} as User;
    public hobbies: any[] 
    public time: any[]
    public numOfMeeting: any[]
    
  constructor(public navCtrl: NavController ,public alertCtrl: AlertController, public params: NavParams) 
  {
    console.log("if elderly:")
    this.user.elderly = this.params.get('elderly');
    console.log(this.user.elderly)

    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    this.user.onBehalf = false;
    this.user.nameAssistant = null;
    this.user.relationship = null;
    this.user.range = 0;

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


    this.time = [
      {
          'species' : 'בוקר',
          'currentValue' : false
      },{
          'species' : 'אחה"צ',
          'currentValue' : false
      },{
          'species' : 'ערב',
          'currentValue' : false
      },{
          'species' : 'לא משנה',
          'currentValue' : false
      }];


      this.numOfMeeting = [
        {
            'species' : 'פעם בשבוע/ שבועיים',
            'currentValue' : false
        },{
            'species' : 'פעם בחודש',
            'currentValue' : false
        },{
            'species' : 'באופן אקראי',
            'currentValue' : false
        }];


    if(this.user.loggedIn)
      this.get_data_from_firebase();
  }


 async registry()
  {
    if(this.user.email == "" ||this.user.password == "")
       this. error_emptyEmailOrPassword();

    else
    {

      try{
        const res = await firebase.auth().createUserWithEmailAndPassword
        (this.user.email, this.user.password);
        if(res)
          this.showAlert();
      }
      catch(e)
      {
        console.error(e);
        if(e.message == "The email address is already in use by another account.")
          this.error_emailIsAllreadyExist();
        else
          this.error_illegalEmailOrPassword();
      }
  }
  }


  //if the user want to change his user to password 
  update_email_or_password()
  {
    firebase.auth().currentUser.updatePassword(this.user.password);
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.showAlert_changeEmailAndPassword();
    this.navCtrl.push(HomePage);
  }

  click_home()
  {
    this.navCtrl.push(HomePage , {'login': this.user.loggedIn});
  }
  
  //check all user inputs are legal
  check_field_value()
  {
    let flag = 0;
    console.log("range:")
    console.log(this.user.range);

    if(typeof(this.user.fullName) === "undefined"  ||typeof(this.user.phone) === "undefined" 
    || typeof(this.user.address) === "undefined")
     { this. error_emptyFields();
      flag=1;}

    else if(this.check_array1() == 1){
      this.error_hobbies();
      flag=1;}

    else if(this.check_array2() == 1)
    {
      this.error_timeOfMeeting();
      flag=1;}

    else if(!this.user.elderly)
    {
      if(this.check_array3() ==1)
      {
        this.error_numOfMeeting();
        flag=1;}
    }

    if(flag == 0)
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

// ------------------------------ firebase functions ---------------------------------

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
        range: this.user.range,
        meeting_time: this.time,
        num_of_meetings: this.numOfMeeting
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
        meeting_time: this.time
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
          this.hobbies = result.data().hobbies,
          this.time = result.data().meeting_time
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
          this.user.range = result.data().range,
          this.time = result.data().meeting_time
          this.numOfMeeting = result.data().num_of_meetings
       })
    }
  }

  //---------------------- checkbox and radio functions ------------------------

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
  
  
    //check which radio was clicked and update the array
    radioClicked1(item: any, $event)
    {
      console.log('radioClicked for ' + item.species);
      for(let i = 0 ; i< this.time.length ; i++)
      {
        if(this.time[i].currentValue) //if this radio was pressed
        this.time[i] = {
            'species' : this.time[i].species,
           'currentValue' : !this.time[i].currentValue
          }
  
        if(this.time[i] === item)
          this.time[i] ={
            'species' : item.species,
            'currentValue' : !item.currentValue
          };
      }
    }
  
     //check which radio was clicked and update the array
     radioClicked2(item: any, $event)
     {
       console.log('radioClicked for ' + item.species);
       for(let i = 0 ; i< this.numOfMeeting.length ; i++)
       {
         if(this.numOfMeeting[i].currentValue) //if this radio was pressed
         this.numOfMeeting[i] = {
             'species' : this.numOfMeeting[i].species,
            'currentValue' : !this.numOfMeeting[i].currentValue
           }
   
         if(this.numOfMeeting[i] === item)
           this.numOfMeeting[i] ={
             'species' : item.species,
             'currentValue' : !item.currentValue
           };
       }
     }


  //-------- methods that check if the array are have 'ture' value --------

  check_array1()
  {
    for(let i = 0 ; i< this.hobbies.length ; i++)
    {
      if(this.hobbies[i].currentValue)
        return 0;
    }
    return 1;
  }

  check_array2()
  {
    for(let i = 0 ; i< this.time.length ; i++)
    {
      if(this.time[i].currentValue) //if this radio was pressed
        return 0;
    }
    return 1;
  }

  check_array3()
  {
    for(let i = 0 ; i< this.numOfMeeting.length ; i++)
    {
      if(this.numOfMeeting[i].currentValue) //if this radio was pressed
        return 0;
    }
    return 1;
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

  
  showAlert_changeEmailAndPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'בוצע',
      subTitle: 'כתובת הדוא"ל והסיסמה שונו בהצלחה',
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


  error_emptyFields()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא את כל השדות',
      buttons: ['OK']
    });
    alert.present();
  }

  
  error_emptyEmailOrPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: '!חובה למלא כתובת דוא"ל וסיסמא',
      buttons: ['OK']
    });
    alert.present();
  }


  error_illegalEmailOrPassword()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה למלא כתובת דוא"ל מהצורה exapmle@example.com <br> וסיסמא באורך של 6 תווים לפחות',
      buttons: ['OK']
    });
    alert.present();
  }


  error_hobbies()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור תחביב אחד לפחות',
      buttons: ['OK']
    });
    alert.present();
  }


  error_timeOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle: 'חובה לבחור זמן שמתאים למפגש',
      buttons: ['OK']
    });
    alert.present();
  }


  error_numOfMeeting()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:'חובה לבחור תדירות מפגשים',
      buttons: ['OK']
    });
    alert.present();
  }


  error_emailIsAllreadyExist()
  {
    let alert = this.alertCtrl.create({
      title: 'שגיאה',
      subTitle:'כתובת הדוא"ל כבר קיימת המערכת',
      buttons: ['OK']
    });
    alert.present();
  }

}
