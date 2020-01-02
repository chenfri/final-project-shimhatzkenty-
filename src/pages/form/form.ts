import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import firebase from 'firebase';
import { AlertProvider } from '../../providers/alert/alert'
import { Arrays } from '../../providers/arrays'
import {Functions} from '../../providers/functions'
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import {MyGlobal} from '../../module/global'
import {AngularFireAuth} from 'angularfire2/auth';
import { Geolocation} from '@capacitor/core';
import { ThrowStmt } from '@angular/compiler';

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
  public place: any[]
  public gender: any[]
  public musicStyle: any[]
  public language: any[]
  public meetingWith: any[]
  public neighborhood: any[]
  public musical_instrument: any[]
  public dayOfMeeting: any[]
  public organization: any[]
  public ifRegister = false

  constructor(public navCtrl: NavController, public params: NavParams, private platform: Platform,
          public alert: AlertProvider, public fun:Functions , public array:Arrays, public auth:AngularFireAuth)
    {

    this.user.loggedIn = this.params.get('login');
    console.log("login :", this.user.loggedIn)
    this.user.elderly = this.params.get('elderly');
    console.log("elderly :", this.user.elderly)
    this.user.volunteer = this.params.get('volunteer');
    console.log("volunteer :", this.user.volunteer)
 
    //update variables
    this.user.nameAssistant = null;
    this.user.relationship = null;
    this.user.college = null
    this.user.id = null
    this.user.contact = null
    this.user.range = 0;
    this.user.age = 0
    this.user.hideMusic = false
    this.user.student = false
    this.user.onBehalf = false;

    this.hobbies = this.array.hobbies
    this.time = this.array.time
    this.numOfMeeting = this.array.numOfMeeting
    this.place = this.array.place
    this.gender = this.array.gender
    this.musicStyle = this.array.musicStyle
    this.language = this.array.language
    this.meetingWith = this.array.meetingWith
    this.neighborhood = this.array.neighborhood
    this.musical_instrument = this.array.musical_instrument
    this.dayOfMeeting = this.array.dayOfMeeting
    this.organization = this.array.organization

    if (this.user.loggedIn)
    {
      this.user.hideForm = true
      if(this.user.volunteer)
        this.getData_fromFirebase('volunteerUsers');
      else
        this.getData_fromFirebase('ElderlyUsers');
    }
    else
      this.user.hideForm = false
     
  }


  async registry()
  {
    let str = await this.fun.registry(this.user.email, this.user.password)
    if(str == "sucsses"){
      this.ifRegister = true;
      this.alert.showAlert();
      this.user.hideForm = true;}


    /*this.alert.showError_NotEmailVerfied();

    setTimeout(() => {
      if(str == "sucsses")
      this.alert.showAlert();
    }, 5000);*/
  }


  //if the user want to change his user to password 
  update_email_or_password()
  {
    firebase.auth().currentUser.updatePassword(this.user.password);
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.alert.showAlert_changeEmailAndPassword();
    
    this.navCtrl.push(HomePage, {
      'login': this.user.loggedIn, 'elderly': this.user.elderly
      , 'volunteer': this.user.volunteer
    });
  }


  //if the user press on home page button and he didn't finish fill the form
  click_home()
  {
    const db = firebase.firestore();
    if(this.ifRegister) //if the user is allready register check if there is his document in firebase
    {
      if (this.user.elderly)
      {
        db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result => {
            if (!result.exists)
              this.alert.error_showAlert()
          }).catch(error => console.log(error))
      }
      else if (this.user.volunteer)
      {
        db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result => {
            if (!result.exists)
              this.alert.error_showAlert()
          }).catch(error => console.log(error))
      }
    }
    else
      this.navCtrl.push(HomePage, {
        'login': this.user.loggedIn, 'elderly': this.user.elderly,
        'volunteer': this.user.volunteer
      })
  }


  //check that all user inputs are legal
  check_field_value()
  {
    let flag = 0;

    if (typeof (this.user.fullName) === "undefined" || typeof (this.user.phone) === "undefined"
      || typeof (this.user.address) === "undefined") {
      this.alert.error_emptyFields();
      flag = 1;
    }

    else if (!this.user.elderly && (this.user.age == 0 || this.user.range == 0))
    {
      if(this.user.age == 0)
      {
        this.alert.showError_age()
        flag = 1;
      }
      else if(this.user.range == 0)
      {
        this.alert.showAlert_chooseRange()
        flag = 1;
      }
    }

    else if (this.user.student && (this.user.id == null || this.user.college == null))
    {
       this.alert.showError_studentDetails();
       flag = 1;
    }

    else if (this.user.onBehalf && (this.user.nameAssistant == null || this.user.contact == null))
    {
      this.alert.showError_behalf();
       flag = 1;
    }
    
    else if(this.user.onBehalf && (this.user.relationship == null && this.check_arrayVaule(this.organization) == 1))
    {  this.alert.showError_relationship();
       flag = 1;
    }

    else if (this.check_arrayVaule(this.hobbies) == 1) {
      this.alert.error_hobbies();
      flag = 1;
    }

    else if (this.check_arrayVaule(this.language) == 1) {
      this.alert.showError_language();
      flag = 1;
    }

    else if (this.check_arrayVaule(this.neighborhood) == 1) {
      this.alert.showError_neighborhood();
      flag = 1;
    }

    else if (this.check_arrayVaule(this.meetingWith) == 1) {
      this.alert.showError_meetingWith();
      flag = 1;
    }
    else if(this.user.student || this.user.elderly)
    { 
      if (this.check_arrayVaule(this.dayOfMeeting) == 1) {
      this.alert.showError_dayOfMeeting();
      flag = 1;}
    }

    else if (!this.user.elderly)
    {
      if (this.check_arrayVaule(this.numOfMeeting) == 1 && !this.user.student) {
        this.alert.error_numOfMeeting();
        flag = 1;
      }

     /* else if (this.check_arrayVaule(this.place) == 1) {
        this.alert.error_place();
        flag = 1;
      }  */

      /*else if (this.check_arrayVaule(this.musicStyle) == 1) {
        this.alert.showError_musicStyle();
        flag = 1;
      }  */

      /*else if (this.check_arrayVaule(this.musical_instrument) == 1) {
        this.alert.showError_musical_instrument();
        flag = 1;
      }  */

     /* if (this.check_arrayVaule(this.time) == 1) {
        this.alert.error_timeOfMeeting();
        flag = 1;
      }*/
    }

    if (flag == 0)
    {
      if (this.user.elderly)
        this.add_data_to_firebase_Elderly();
      else
        this.add_data_to_firebase_Volunteer();
    }
  }


  //update the variables if someone fill the form behalf elderly
  onbehalf()
  {
    if (this.user.onBehalf === false)
      this.user.onBehalf = true;
    else
    {
      this.user.onBehalf = false;
      this.user.nameAssistant = null;
      this.user.relationship = null;
    }
  }

  
  ifStudent()
  {
    if (this.user.student === false)
      this.user.student = true;
    else
    {
      this.user.student = false;
      this.user.id = null;
      this.user.college = null;
    }
  }

  //check if in the array there is 'ture' value
  check_arrayVaule(arr)
  {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].currentValue)
        return 0;
    }
    return 1;
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
        alert(address.results[0].formatted_address)
        MyGlobal.address = address.results[0].formatted_address
      }
    };

    xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," +
      long + "&key=AIzaSyCZBHhiOHheytNnAa-8tfwek4rZNQtSTzs", true);
    xhttp.send();
  }

  
  get_UserLocation()
  {
    //if(this.platform.is('android'))
    //  alert("please turn on GPS")

    navigator.geolocation.getCurrentPosition(this.getUserAddressByCoordinates)
    setTimeout(() => {
      console.log(MyGlobal.address)
      this.user.address = MyGlobal.address
      console.log(this.user.address)
    }, 5000);
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
        num_of_meetings: this.numOfMeeting,
       // placeOfMeeting: this.place,
        gender: this.gender,
        age: this.user.age,
        language: this.language,
        meetingWith: this.meetingWith,
        neighborhood: this.neighborhood,
        student: this.user.student,
        college: this.user.college,
        id: this.user.id,
        hideMusic: this.user.hideMusic,
        dayOfMeeting: this.dayOfMeeting,
        musical_instrument: this.musical_instrument,
        musicStyle: this.musicStyle,
        loggedIn: this.user.loggedIn,
        password: this.user.password
        
      })
      .then(() => {
        this.alert.showAlertSuccess();
        this.init_arrays()
        this.navCtrl.push(HomePage, {
          'login': this.user.loggedIn, 'elderly': this.user.elderly,
          'volunteer': this.user.volunteer
        })
      }).catch((error) => {
        console.log
      })
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
        gender: this.gender,
        behalf: this.user.onBehalf,
        nameAssistant: this.user.nameAssistant,
        relationship: this.user.relationship,
        contact: this.user.contact,
        organization: this.organization,
        hobbies: this.hobbies,
        meeting_time: this.time,
        musicStyle: this.musicStyle,
        language: this.language,
        meetingWith: this.meetingWith,
        neighborhood: this.neighborhood,
        hideMusic: this.user.hideMusic,
        dayOfMeeting: this.dayOfMeeting,
        loggedIn: this.user.loggedIn,
        password: this.user.password
      })
      .then(() => {
        this.alert.showAlertSuccess();
        this.init_arrays()
        this.navCtrl.push(HomePage, {
          'login': this.user.loggedIn, 'elderly': this.user.elderly
          , 'volunteer': this.user.volunteer
        });
      }).catch((error) => {
        console.log
      })
  }


    //init all arrays for 'false' value
    init_arrays()
    {
      this.init(this.hobbies)
      this.init(this.numOfMeeting )
      this.init(this.gender)
      this.init(this.musicStyle)
      this.init(this.language)
      this.init(this.meetingWith)
      this.init(this.neighborhood)
      this.init(this.musical_instrument)
      this.init(this.dayOfMeeting)
      this.init(this.organization)
    }
  
  
    init(arr)
    {
      for(let i = 0 ; i < arr.length ; i++)
        arr[i].currentValue = false
    }
  

  getData_fromFirebase(str)
  {
    console.log("av")
    console.log(firebase.auth().currentUser.uid)
    const db = firebase.firestore();
    db.collection(str).doc(firebase.auth().currentUser.uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.fullName = result.data().fullName
      this.user.address = result.data().address
      this.user.phone = result.data().phone
      this.user.email = result.data().email
      this.hobbies = result.data().hobbies
      this.time = result.data().meeting_time
      this.gender = result.data().gender
      this.language = result.data().language
      this.meetingWith = result.data().meetingWith
      this.neighborhood = result.data().neighborhood
      this.user.hideMusic = result.data().hideMusic
      this.dayOfMeeting = result.data().dayOfMeeting
      this.musicStyle = result.data().musicStyle
      this.user.password = result.data().password

      if(this.user.volunteer)
      {
        this.user.range = result.data().range,
        this.numOfMeeting = result.data().num_of_meetings
       // this.place = result.data().placeOfMeeting
        this.user.age = result.data().age
        this.user.id = result.data().id
        this.user.college = result.data().college
        this.user.student = result.data().student
        this.musical_instrument = result.data().musical_instrument
      }
      else{
        this.user.onBehalf = result.data().behalf
        this.user.nameAssistant = result.data().nameAssistant
        this.user.relationship = result.data().relationship
        this.organization = result.data().organization
        this.user.contact = result.data().contact
      }

    }).catch(error => {console.log(error)})
    
  }


  //---------------------- checkbox and radio functions ------------------------

  CheckboxClicked1(item: any, $event)
  {
    this.CheckboxClicked(item, this.hobbies)
    if(this.hobbies[0].currentValue)
      this.user.hideMusic = true;
    else
    this.user.hideMusic = false;
  }

  CheckboxClicked2(item: any, $event)
  {
    this.CheckboxClicked(item, this.musicStyle)
  }


  CheckboxClicked3(item: any, $event)
  {
    this.CheckboxClicked(item, this.language)
  }

  
  CheckboxClicked4(item: any, $event)
  {
    this.CheckboxClicked(item, this.neighborhood)
  }

  CheckboxClicked5(item: any, $event)
  {
    this.CheckboxClicked(item, this.musical_instrument)
  }

  CheckboxClicked6(item: any, $event)
  {
    this.CheckboxClicked(item, this.dayOfMeeting)
  }

  //check which checkbox was clicked and update the array
  CheckboxClicked(item: any, arr)
  {
    console.log('CheckboxClicked for ' + item.species);
    for (let i = 0; i < arr.length; i++) {

      if (arr[i] === item)
          arr[i] = {
          'species': item.species,
          'currentValue': !item.currentValue
        };
    }
  }

  radioClicked1(item: any, $event) {
    this.radioClicked(item, this.time)
  }

  radioClicked2(item: any, $event) {
    this.radioClicked(item, this.numOfMeeting)
  }

  radioClicked3(item: any, $event) {
    this.radioClicked(item, this.place)
  }

  
  radioClicked4(item: any, $event) {
    this.radioClicked(item, this.gender)
  }

  radioClicked5(item: any, $event) {
    this.radioClicked(item, this.meetingWith)
  }

  //check which radio was clicked and update the array
  radioClicked(item: any, arr)
  {
    console.log('radioClicked for ' + item.species);
    for (let i = 0; i < arr.length; i++)
    {
      if (arr[i].currentValue) //if this radio was pressed
        arr[i] = {
          'species': arr[i].species,
          'currentValue': !arr[i].currentValue
        }

      if (arr[i] === item)
        arr[i] = {
          'species': item.species,
          'currentValue': !item.currentValue
        };
    }
  }

  select(item)
  {
    this.radioClicked(item, this.organization)
  }

}


