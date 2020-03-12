import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import * as firebase from 'firebase';
import { AlertProvider } from '../../providers/alert/alert'
import { Arrays } from '../../providers/arrays'
import {Functions} from '../../providers/functions'
import { Component ,ViewChild} from '@angular/core';
import {returnValue ,MyGlobal} from '../../module/global'
import {AngularFireAuth} from 'angularfire2/auth';
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import {SelectSearchableComponent} from 'ionic-select-searchable'

@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})


export class Form 
{
  @ViewChild('mySelect') selectComponent:SelectSearchableComponent
  user = {} as User;
  public ifRegister = false
   public hideMoreContact = false;
  public familyMember: any[];
  public gender: any[]
  public musicStyle: any[]
  public language: any[]
  public meetingWith: any[]
  public zone: any[]
  public musical_instrument: any[]
  public dayOfMeeting: any[]
  public organization: any[]
  public neighborhoods: any[]
  public hobbies: any[]
  public time: any[]
  public numOfMeeting: any[]
  public place: any[]
 public relationship: any[]

  public orgi
  public gender_
  public meetingWith_
  public numOfMeeting_
  public relationship_
  public selectedNH : any
  public fixedAddress : any
  public showOtherO = false
  public showOtherR = false


  temp_familyMember = new Array(3)
  name_familyMember = new Array(3)
  phone_familyMember = new Array(3)
  relationship_familyMember = new Array(3)
 
  
  constructor(public navCtrl: NavController, public params: NavParams,
          public alert: AlertProvider, public func:Functions , public array:Arrays, public auth:AngularFireAuth,
          public events: Events, private http: HttpClient)
          
    {

    this.user.elderly = this.params.get('elderly')
    this.user.volunteer = this.params.get('volunteer')

    //update variables
    this.selectedNH = null
    this.user.orgName = null
    this.user.city = null
    this.user.nameAssistant = null
    this.user.relationName = null
    this.user.college = null
    this.user.id = null
    this.user.contact = null
    this.user.description = null
    this.user.range = 0
    this.user.age = null
    this.user.dateTime = null
    this.familyMember = null
    this.user.fullName = null
    this.user.hideMusic = false
    this.user.student = false
    this.user.onBehalf = false
    this.user.numOfAssistant = 0
    this.orgi = null
    this.gender_ = null
    this.meetingWith_ = null
    this.numOfMeeting_ = null
    this.relationship_ = null

    this.hobbies = this.array.hobbies
    this.time = this.array.time
    this.numOfMeeting = this.array.numOfMeeting
    this.place = this.array.place
    this.gender = this.array.gender
    this.musicStyle = this.array.musicStyle
    this.language = this.array.language
    this.meetingWith = this.array.meetingWith
    this.zone = this.array.zone
    this.musical_instrument = this.array.musical_instrument
    this.dayOfMeeting = this.array.dayOfMeeting
    this.organization = this.array.organization
    this.neighborhoods = this.array.neighborhoods
    this.relationship = this.array.relationship

  }


  //if the user press on home page button and he didn't finish fill the form
  click_home()
  {
    this.init_arrays()
    this.navCtrl.setRoot(HomePage)
  }


  moreContact()
  {
    if(!this.hideMoreContact)
      this.hideMoreContact = true
    else
      this.hideMoreContact = false
  }


  checkIfPhoneExist()
  {
    const db = firebase.firestore();
    if (this.user.elderly)
    {
      db.collection('ElderlyUsers').get().then(res => { res.forEach(i => {
        if(i.data().phone == this.user.phone)
          returnValue.phoneExist = 1    
          })}).catch(error => {console.log(error)}) 
    }

    else if (this.user.volunteer)
    {
        db.collection('volunteerUsers').get().then(res => { res.forEach(i => {
          if(i.data().phone == this.user.phone)
          returnValue.phoneExist = 1
            })}).catch(error => {console.log(error)}) 
    }

    returnValue.phoneExist = 0
  }


  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  validateCellPhoneNumber(phone)
  {
    var phoneRe =  /^\(?(05[0-9]{1})\)?([0-9]{3})?([0-9]{4})$/;
    var digits = phone.replace(/[-.]/g, "");
    return phoneRe.test(digits);
  }


  validatePhoneNumber(phone)
  {
    var phoneRe =  /^\(?(0[1-9]{1})\)?([0-9]{7})$/;
    var digits = phone.replace(/[-.]/g, "");
    return phoneRe.test(digits);
  }


  //check that all user inputs are legal
  check_field_value()
  {
    
    let flag = 0;
    //convert the phone to string for do more checks
    let phone =  String(this.user.phone);
    let contact = String(this.user.contact)
    let temp = "0"
    phone = temp.concat("",phone);
    contact = temp.concat("",contact);

    this.checkIfPhoneExist() 

    setTimeout(() => 
    {

      if (this.user.fullName == null && !this.user.elderly)
      {
          this.alert.error_emptyFullName();
          flag = 1;
      }
  
      else if (typeof (this.user.email) === "undefined" || !this.validateEmail(this.user.email)) {
        this.alert.error_illegalEmail()
        flag = 1;
      }
  
      else if (typeof (this.user.phone) === "undefined" || !this.validateCellPhoneNumber(phone)) {
        this.alert.error_emptyPhone()
        flag = 1;
      }

      else if (returnValue.phoneExist == 1) {
        this.alert.error_phoneIsAllreadyExist()
        flag = 1;
      }
  
      else if (!this.user.elderly && (this.user.id == null ||String(this.user.id).length != 9))
      {
        this.alert.showError_studentID()
         flag = 1;
      }
  
      else if (this.selectedNH == null || typeof(this.user.street) === "undefined")
      {
        this.alert.showError_address();
        flag = 1;
      }
  
  
      else if (this.user.onBehalf && (this.user.nameAssistant == null || this.user.contact == null
         ||(!this.validateCellPhoneNumber(contact) && !this.validatePhoneNumber(contact))))
      {
        this.alert.showError_behalf();
         flag = 1;
      }
  
      else if(this.user.onBehalf && (this.relationship == null && this.orgi == null))
      { 
         this.alert.showError_relationship();
         flag = 1;
      }
    
      else if((this.showOtherR && this.user.relationName == null) || (this.showOtherO && this.user.orgName == null))
      { 
         this.alert.showError_otherField();
         flag = 1;
      }
  
      else if (!this.user.elderly && this.user.range == 0)
      {
        this.alert.showAlert_chooseRange()
        flag = 1;
      }

      else if (this.gender_ == null)
      {
        this.alert.showError_gender()
        flag = 1;
      }
  
      else if (!this.user.elderly && this.user.age == null)
      {
          this.alert.showError_age()
          flag = 1;
      }

      else if (this.user.student && this.user.college == null)
      {
         this.alert.showError_studentDetails();
         flag = 1;
      }
      
  
      else if (this.check_arrayVaule(this.hobbies) == 1) {
        this.alert.error_hobbies();
        flag = 1;
      }
  
      else if (!this.user.elderly && this.check_arrayVaule(this.zone) == 1) {
        this.alert.showError_zone();
        flag = 1;
      }
  
      else if (this.check_arrayVaule(this.language) == 1) {
        this.alert.showError_language();
        flag = 1;
      }
  
  
      else if(this.user.student || this.user.elderly)
      { 
        if (this.check_arrayVaule(this.dayOfMeeting) == 1) {
        this.alert.showError_dayOfMeeting();
        flag = 1;}
      }
  
      else if (!this.user.elderly && !this.user.student)
      {
        if (this.numOfMeeting_ == null) {
          this.alert.error_numOfMeeting();
          flag = 1;
        }
      }
    
      if (this.user.fullName == null && this.user.elderly)
        this.user.fullName = 'חסוי'


      if (flag == 0)
      {
        if (this.user.elderly)
          this.add_data_to_firebase_Elderly();
        else
          this.add_data_to_firebase_Volunteer();
      }


    }, 500);
  }
  

  add_familyMembers()
  {
    let size = this.phone_familyMember.length
    let arr=[];

    for(let index = 0 ; index < size ; index++)
    {
    if(this.name_familyMember[index] != null && this.phone_familyMember[index] && this.relationship_familyMember[index]) 
      arr[index]={'name':this.name_familyMember[index],
      'phone':this.phone_familyMember[index],'rel': this.relationship_familyMember[index]};
    }
    
    this.familyMember = arr
    console.log(this.familyMember)
  }


  //update the variables if someone fill the form behalf elderly
  onbehalf()
  {
    if (this.user.onBehalf === false){
      this.user.onBehalf = true;
    }
    else
    {
      this.user.onBehalf = false;
      this.user.nameAssistant = null;
      this.user.relationName = null;  
    }
  }

  
  ifStudent()
  {
    if (this.user.student === false)
      this.user.student = true;
    else
    {
      this.user.student = false;
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
        MyGlobal.street = address.results[0].address_components[1].long_name
        MyGlobal.city = address.results[0].address_components[0].long_name
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
      this.user.street = MyGlobal.street
      this.user.city = MyGlobal.city
    }, 1000);
  }


  // ------------------------------ firebase functions ---------------------------------

  add_data_to_firebase_Volunteer()
  {
    this.arrangeAddress();
    this.arrangeDate();

    const db = firebase.firestore();
    db.collection('volunteerUsers').doc().set(
      {
        fullName: this.user.fullName,
        address: this.fixedAddress,
        phone: this.user.phone,
        email: this.user.email,
        range: this.user.range,
        age: this.user.age,
        student: this.user.student,
        college: this.user.college,
        id: this.user.id,
        num_of_meetings: this.numOfMeeting_,
        meetingWith: this.meetingWith_,
        dateTime : this.user.dateTime ,
        gender: this.gender_,
        language: this.language,
        hobbies: this.hobbies,
        zone: this.zone,
        dayOfMeeting: this.dayOfMeeting,
        musical_instrument: this.musical_instrument,
        musicStyle: this.musicStyle,
      })
      .then(() => {
        this.alert.showAlertSuccess();
        this.init_arrays()
        this.navCtrl.popToRoot()
      }).catch((error) => {
        console.log
      })
  }


  arrangeDate()
  {
    this.user.dateTime = new Date().toISOString().substring(0, 10);

    let temp2 = "";
    temp2= this.user.dateTime[8] +this.user.dateTime[9] + "-" +this.user.dateTime[5] +this.user.dateTime[6]
          +"-"+ this.user.dateTime[0] +this.user.dateTime[1]+this.user.dateTime[2] +this.user.dateTime[3];
    
    this.user.dateTime = temp2;
  }


  arrangeAddress()
  {
    let temp = this.selectedNH.species + ", "+ this.user.street
    if (this.user.city != null)
      temp += " " + this.user.city
    
    this.fixedAddress =  temp
  }


  add_data_to_firebase_Elderly()
  {
    this.arrangeAddress();
    this.arrangeDate();
    
    if(this.hideMoreContact)
      this.add_familyMembers();

    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc().set(
      {
        fullName: this.user.fullName,
        address: this.fixedAddress,
        phone: this.user.phone,
        email: this.user.email,
        behalf: this.user.onBehalf,
        relationName: this.user.relationName,
        nameAssistant: this.user.nameAssistant,
        orgi: this.orgi,
        gender: this.gender_,
        orgName: this.user.orgName,
        contact: this.user.contact,
        dateTime : this.user.dateTime ,
        description: this.user.description,
        meetingWith: this.meetingWith_,
        relationship: this.relationship_,
        hobbies: this.hobbies,
        musicStyle: this.musicStyle,
        language: this.language,
        dayOfMeeting: this.dayOfMeeting,
        familyMember: this.familyMember,
      })
      .then(() => {
        this.alert.showAlertSuccess();
        this.init_arrays()
        this.navCtrl.popToRoot();
      }).catch((error) => {
        console.log
      })
  }


    //init all arrays for 'false' value
    init_arrays()
    {
      this.init(this.hobbies)
      this.init(this.numOfMeeting)
      this.init(this.gender)
      this.init(this.musicStyle)
      this.init(this.language)
      this.init(this.meetingWith)
      this.init(this.zone)
      this.init(this.musical_instrument)
      this.init(this.dayOfMeeting)
      this.init(this.organization)
      this.init(this.neighborhoods)
      this.init(this.relationship)
    }
  
  
    init(arr)
    {
      for(let i = 0 ; i < arr.length ; i++)
        arr[i].currentValue = false
    }
  

  //---------------------- checkbox and radio functions ------------------------

  CheckboxClicked1(item: any, $event)
  {
    this.CheckboxClicked(item, this.hobbies)
    if(this.hobbies[0].currentValue)
      this.user.hideMusic = true;
    else
    {
      this.cancelCheckBox(this.musicStyle)
      this.cancelCheckBox(this.musical_instrument)
      this.user.hideMusic = false;
    }
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
    this.CheckboxClicked(item, this.zone)
  }

  CheckboxClicked5(item: any, $event)
  {
    this.CheckboxClicked(item, this.musical_instrument)
  }

  CheckboxClicked6(item: any, $event)
  {
    this.CheckboxClicked(item, this.dayOfMeeting)
  }


  //if user cancel music hobby so we cancel musicStyle and musical_instrument
  cancelCheckBox(arr)
  {  
      for (let i = 0; i < arr.length; i++)
      {
        if (arr[i].currentValue)
        {
          console.log(arr[i].species)
          arr[i].currentValue = false
        }    
      }
  }
  

  //check which checkbox was clicked and update the array
  CheckboxClicked(item: any, arr)
  {
    for (let i = 0; i < arr.length; i++)
    {
      if (arr[i] === item)
          arr[i].currentValue = !item.currentValue
    }
  }

  radioClicked1(item: any, $event) {
    this.radioClicked(item, this.time)
  }

  radioClicked2(item: any, $event) {
    this.numOfMeeting_ = item.id
    this.radioClicked(item, this.numOfMeeting)
  }

  radioClicked3(item: any, $event) {
    this.radioClicked(item, this.place)
  }

  
  radioClicked4(item) {
    this.gender_ = item.id
    console.log(item)
    console.log(this.gender_)
    this.radioClicked(item, this.gender)
  }

  radioClicked5(item: any, $event) {
    this.meetingWith_ = item.id
    this.radioClicked(item, this.meetingWith)
  }

  radioClicked6(item: any, $event) {
    this.radioClicked(item, this.zone)
  }

  

  //check which radio was clicked and update the array
  radioClicked(item: any, arr)
  {
    for (let i = 0; i < arr.length; i++)
    {
      if (arr[i].currentValue) //cancel other radio if it pressed
        arr[i].currentValue = !arr[i].currentValue

      if (arr[i] === item)
        arr[i].currentValue =  !item.currentValue
    }
  }


  selectOrg(item)
  {
    this.orgi = item.id
    if(item.id == 4)
      this.showOtherO = true
    else
      this.showOtherO = false
    this.selectTagClicked(item, this.organization)
  }


  select_neighborhood(event:{component: SelectSearchableComponent, value:any})
  {
    this.selectTagClicked(event.value, this.neighborhoods)
  }


  select_relationship(item: any, $event)
  {
    this.relationship_ = item.id
    if(item.id == 7)
      this.showOtherR = true
    else
      this.showOtherR = false
    this.selectTagClicked(item, this.relationship)
  }


  selectTagClicked(item , arr)
  {
    for (let i = 0; i < arr.length; i++)
    {
      if (arr[i] != item && arr[i].currentValue) 
        arr[i].currentValue = !arr[i].currentValue
        
      if (arr[i] === item && !arr[i].currentValue)
        arr[i].currentValue = !item.currentValue
    }
  }

  //------------------------- function not in used ------------------------
  

  
  getData_fromFirebase(str)
  {
    const db = firebase.firestore();

    db.collection(str).doc(firebase.auth().currentUser.uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.fullName = result.data().fullName
      this.user.street = result.data().address[0]
      this.selectedNH = {
        'species': result.data().address[2],
        'currentValue': true
      }

      this.user.city = result.data().address[3]
      this.user.phone = result.data().phone
      this.user.email = result.data().email
      this.hobbies = result.data().hobbies
      //this.time = result.data().meeting_time
      this.gender = result.data().gender
      this.language = result.data().language
      this.meetingWith = result.data().meetingWith
      this.zone = result.data().zone
      this.user.hideMusic = result.data().hideMusic
      this.dayOfMeeting = result.data().dayOfMeeting
      this.musicStyle = result.data().musicStyle
      this.user.password = result.data().password

      if(this.user.volunteer)
      {
        this.user.range = result.data().range,
        this.user.age = result.data().age
        this.user.id = result.data().id
        this.user.student = result.data().student
        this.musical_instrument = result.data().musical_instrument
        this.user.dateTime = result.data().dateTime 
        //this.durationVol = result.data().durationVol
        this.numOfMeeting = result.data().num_of_meetings
        this.user.college = result.data().college
      }
      else
      {
        this.familyMember = result.data().familyMember
        this.user.onBehalf = result.data().behalf
        this.user.nameAssistant = result.data().nameAssistant
       // this.user.relationship = result.data().relationship
        this.organization = result.data().organization
        this.user.contact = result.data().contact
        this.user.description = result.data().description
      }

    }).catch(error => {console.log(error)})
  }


  //read list of neighborhoods from csv file
  readCsvData()
  {
    let array = []
    let data = '' , index = 0;

    this.http.get('./assets/neighborhoods.csv', {responseType: 'text'}).subscribe(res => {
      data = res
    }, err => console.error(err))


    //convert the string to array of object
    setTimeout(() => 
    {
      for(let i = 0 ;i < 57; i ++)
      {
        let x = '';
        for (let k = index ; k < data.length ; k++)
        {
          if(data[k] == '\n')
          {
            index = k+1
            break
          }
          x += data[k]
        }
   
        array[i] = {'species': x,
        'currentValue': false}
      }
      this.neighborhoods = array
      console.log(this.neighborhoods)
    }, 3000);
    
  }


  async registry()
  {
    let str = await this.func.registry(this.user.email, this.user.password)
    if(str == "sucsses"){
      this.ifRegister = true;
      this.user.hideForm = true;
      // console.log('User created! , ' + this.user.dateTime)
    }

    // this.alert.showError_NotEmailVerfied();
  }


  //if the user want to change his user to password 
  update_email_or_password()
  {
    firebase.auth().currentUser.updatePassword(this.user.password);
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.alert.showAlert_changeEmailAndPassword();
    
    if(!this.user.loggedIn)
    {
      this.user.elderly = false
      this.user.volunteer = false
    }

    this.navCtrl.push(HomePage, {
      'login': this.user.loggedIn, 'elderly': this.user.elderly
      , 'volunteer': this.user.volunteer
    });
  }

   // createUser(user) {
  //   console.log('User created! , ' + Date.now())
  //   this.events.publish('user:created', user, Date.now());
  // }

}


