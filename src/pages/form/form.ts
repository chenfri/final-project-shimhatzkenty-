import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import firebase from 'firebase';
import { AlertProvider } from '../../providers/alert/alert'
import { Geolocation } from '@ionic-native/geolocation'
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import {MyGlobal} from '../../module/global'

@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})


export class Form 
{
  
  user = {} as User;
  public hobbies: any[]
  public time: any[]
  public numOfMeeting: any[]


  constructor(public navCtrl: NavController, public params: NavParams, private platform: Platform,
              public alert: AlertProvider, private geolocation: Geolocation)
    {
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if elderly:")
    this.user.elderly = this.params.get('elderly');
    console.log(this.user.elderly)

    console.log("if volunteer:")
    this.user.volunteer = this.params.get('volunteer');
    console.log(this.user.volunteer)

    this.user.onBehalf = false;
    this.user.nameAssistant = null;
    this.user.relationship = null;
    this.user.range = 0;

    this.hobbies = [
      {
        'species': 'מוסיקה',
        'currentValue': false
      }, {
        'species': 'שחמט',
        'currentValue': false
      }, {
        'species': 'ששבש',
        'currentValue': false
      }, {
        'species': 'דמקה',
        'currentValue': false
      }, {
        'species': 'דיבור',
        'currentValue': false
      }, {
        'species': 'ריקוד',
        'currentValue': false
      }, {
        'species': 'קסמים',
        'currentValue': false
      }
    ];

    this.time = [
      {
        'species': 'בוקר',
        'currentValue': false
      }, {
        'species': 'אחה"צ',
        'currentValue': false
      }, {
        'species': 'ערב',
        'currentValue': false
      }, {
        'species': 'לא משנה',
        'currentValue': false
      }];

    this.numOfMeeting = [
      {
        'species': 'פעם בשבוע/ שבועיים',
        'currentValue': false
      }, {
        'species': 'פעם בחודש',
        'currentValue': false
      }, {
        'species': 'באופן אקראי',
        'currentValue': false
      }];


    if (this.user.loggedIn)
      this.get_data_from_firebase();

  }


  async registry() {
    if (this.user.email == "undefined" || this.user.password == "undefined")
      this.alert.error_emptyEmailOrPassword();
    else {

      try {
        const res = await firebase.auth().createUserWithEmailAndPassword
          (this.user.email, this.user.password);
        if (res)
          this.alert.showAlert();
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


  //if the user want to change his user to password 
  update_email_or_password() {
    firebase.auth().currentUser.updatePassword(this.user.password);
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.alert.showAlert_changeEmailAndPassword();
    this.navCtrl.push(HomePage, {
      'login': this.user.loggedIn, 'elderly': this.user.elderly
      , 'volunteer': this.user.volunteer
    });
  }


  //if the user press on home page button
  click_home() {
    const db = firebase.firestore();

    if (typeof (this.user.email) != "undefined" && typeof (this.user.password) != "undefined") {
      if (this.user.elderly) {
        db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result => {
            if (!result.exists)
              this.alert.error_showAlert()
          })
      }
      else if (this.user.volunteer) {
        db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result => {
            if (!result.exists)
              this.alert.error_showAlert()
          })
      }
    }
    else
      this.navCtrl.push(HomePage, {
        'login': this.user.loggedIn, 'elderly': this.user.elderly,
        'volunteer': this.user.volunteer
      })
  }


  //check all user inputs are legal
  check_field_value() {
    let flag = 0;
    console.log("range:")
    console.log(this.user.range);

    if (typeof (this.user.fullName) === "undefined" || typeof (this.user.phone) === "undefined"
      || typeof (this.user.address) === "undefined") {
      this.alert.error_emptyFields();
      flag = 1;
    }

    else if (this.check_array1() == 1) {
      this.alert.error_hobbies();
      flag = 1;
    }

    else if (this.check_array2() == 1) {
      this.alert.error_timeOfMeeting();
      flag = 1;
    }

    else if (!this.user.elderly) {
      if (this.check_array3() == 1) {
        this.alert.error_numOfMeeting();
        flag = 1;
      }
    }

    if (flag == 0) {
      if (this.user.elderly)
        this.add_data_to_firebase_Elderly();
      else
        this.add_data_to_firebase_Volunteer();
    }
  }


  //update the variables if someone fill the form behalf elderly
  onbehalf() {
    if (this.user.onBehalf === false)
      this.user.onBehalf = true;
    else {
      this.user.onBehalf = false;
      this.user.nameAssistant = null;
      this.user.relationship = null;
    }
  }


  
  getUserAddressByCoordinates(pos)
  {
    var lat = pos.coords.latitude
    var long = pos.coords.longitude
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function ()
  {
      if (this.readyState == 4 && this.status == 200)
      {
        var address = JSON.parse(this.responseText)
        console.log(address.results[0].formatted_address)
        MyGlobal.address = address.results[0].formatted_address
      }
    };

    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," +
      long + "&key=AIzaSyCZBHhiOHheytNnAa-8tfwek4rZNQtSTzs", true);
    xhttp.send();
  }

  
  get_UserLocation()
  {
    navigator.geolocation.getCurrentPosition(this.getUserAddressByCoordinates)
    setTimeout(() => {
      console.log(MyGlobal.address)
      this.user.address = MyGlobal.address
      console.log(this.user.address)
    }, 5000);
  }

  // ------------------------------ firebase functions ---------------------------------

  add_data_to_firebase_Volunteer() {
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
        this.alert.showAlertSuccess();
        this.navCtrl.push(HomePage, {
          'login': this.user.loggedIn, 'elderly': this.user.elderly,
          'volunteer': this.user.volunteer
        })
      }).catch((error) => {
        console.log
      })
  }


  add_data_to_firebase_Elderly() {
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
        this.alert.showAlertSuccess();
        this.navCtrl.push(HomePage, {
          'login': this.user.loggedIn, 'elderly': this.user.elderly
          , 'volunteer': this.user.volunteer
        });
      }).catch((error) => {
        console.log
      })
  }


  get_data_from_firebase() {
    const db = firebase.firestore();

    if (this.user.elderly) {
      db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
        .then(result => {
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
    else if (this.user.volunteer) {
      db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
        .then(result => {
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
  CheckboxClicked(item: any, $event) {
    //console.log('CheckboxClicked for ' + item.species);
    for (let i = 0; i < this.hobbies.length; i++) {

      if (this.hobbies[i] === item)
        this.hobbies[i] = {
          'species': item.species,
          'currentValue': !item.currentValue
        };
    }
  }


  //check which radio was clicked and update the array
  radioClicked1(item: any, $event) {
    console.log('radioClicked for ' + item.species);
    for (let i = 0; i < this.time.length; i++) {
      if (this.time[i].currentValue) //if this radio was pressed
        this.time[i] = {
          'species': this.time[i].species,
          'currentValue': !this.time[i].currentValue
        }

      if (this.time[i] === item)
        this.time[i] = {
          'species': item.species,
          'currentValue': !item.currentValue
        };
    }
  }

  //check which radio was clicked and update the array
  radioClicked2(item: any, $event) {
    console.log('radioClicked for ' + item.species);
    for (let i = 0; i < this.numOfMeeting.length; i++) {
      if (this.numOfMeeting[i].currentValue) //if this radio was pressed
        this.numOfMeeting[i] = {
          'species': this.numOfMeeting[i].species,
          'currentValue': !this.numOfMeeting[i].currentValue
        }

      if (this.numOfMeeting[i] === item)
        this.numOfMeeting[i] = {
          'species': item.species,
          'currentValue': !item.currentValue
        };
    }
  }


  //-------- methods that check if the array are have 'ture' value --------

  check_array1() {
    for (let i = 0; i < this.hobbies.length; i++) {
      if (this.hobbies[i].currentValue)
        return 0;
    }
    return 1;
  }

  check_array2() {
    for (let i = 0; i < this.time.length; i++) {
      if (this.time[i].currentValue) //if this radio was pressed
        return 0;
    }
    return 1;
  }

  check_array3() {
    for (let i = 0; i < this.numOfMeeting.length; i++) {
      if (this.numOfMeeting[i].currentValue) //if this radio was pressed
        return 0;
    }
    return 1;
  }

}

