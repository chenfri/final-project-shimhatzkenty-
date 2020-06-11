import { NavController, NavParams, ModalController} from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import 'firebase/firestore';
import firebase from 'firebase';
import { AlertProvider } from '../../providers/alert/alert'
import { Arrays } from '../../providers/arrays'
import {Functions} from '../../providers/functions'
import { Component ,ViewChild} from '@angular/core';
import {MyGlobal} from '../../module/global'
import {AngularFireAuth} from 'angularfire2/auth';
import { HttpClient } from '@angular/common/http';
import {SelectSearchableComponent} from 'ionic-select-searchable'
import { ModalPage } from '../modal/modal';


@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
 
})

export class Form 
{
  @ViewChild('mySelect') selectComponent:SelectSearchableComponent
  user = {} as User;
  public familyMember: any[]; gender: any[] ; musicStyle: any[]
  public language: any[] ; meetingWith: any[] ;musical_instrument: any[]
  public dayOfMeeting: any[] ; organization: any[] ; neighborhoods: any[]
  public hobbies: any[] ; time: any[] ; numOfMeeting: any[]; hours: any[];
  public place: any[] ; relationship: any[]

  public orgi ; gender_ ; meetingWith_ ; numOfMeeting_ ; hours_ ; relationship_ ; selectedNH : any
  public selectedFav : any ; fixedAddress : any ; IDlogged:any ; matching: any
  public ifRegister = false; hideMoreContact = false; showOtherO = false
  public showOtherR = false ; showModal = false ; date: any


  temp_familyMember = new Array(3) ;name_familyMember = new Array(3)
  phone_familyMember = new Array(3) ; relationship_familyMember = new Array(3)
 
  
  constructor(public navCtrl: NavController, public params: NavParams,
          public alert: AlertProvider, public func:Functions , public array:Arrays,
          public auth:AngularFireAuth, private http: HttpClient, private modal: ModalController)      
    {
    this.user.loggedIn = this.params.get('login');
    this.user.elderly = this.params.get('elderly')
    this.user.volunteer = this.params.get('volunteer')
    this.user.organization = this.params.get('organization')
    this.IDlogged = this.params.get('IDlogged')

    //update variables
    this.user.email = null ;this.selectedFav = null; this.selectedNH = null
    this.user.orgName = null; this.user.street = null ; this.user.nameAssistant = null
    this.user.relationName = null; this.user.college = null; this.user.id = null
    this.user.contact = null; this.user.age = null; this.user.dateTime = null
    this.familyMember = null; this.user.fullName = null; this.orgi = null
    this.gender_ = null; this.meetingWith_ = null; this.numOfMeeting_ = null
    this.relationship_ = null; this.hours = null; this.user.city = null
    this.user.description = null; this.user.hideMusic = false , this.date = null
    this.user.student = false; this.user.onBehalf = false ; this.user.numOfAssistant = 0

    this.hobbies = this.array.hobbies
    this.user.comments = null
    this.numOfMeeting = this.array.numOfMeeting
    this.hours = this.array.hours
    this.place = this.array.place
    this.gender = this.array.gender
    this.musicStyle = this.array.musicStyle
    this.language = this.array.language
    this.meetingWith = this.array.meetingWith
    this.musical_instrument = this.array.musical_instrument
    this.dayOfMeeting = this.array.dayOfMeeting
    this.organization = this.array.organization
    this.neighborhoods = this.array.neighborhoods
    this.relationship = this.array.relationship

    if(this.user.volunteer)
      this.user.hideForm = false
    else
      this.user.hideForm = true

    if(this.user.loggedIn && this.user.organization)
    {
      this.get_data_fromFirebase_org()
    }
    else if (this.user.loggedIn)
    {
      this.user.hideForm = true
      this.getData_fromFirebaseVol();
    }
    

  }



  async registry()
  {
    let a = ""
    if (this.user.email == "undefined" || this.user.password == "undefined")
      this.alert.error_emptyEmailOrPassword();
    else
    {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password);
        if (res)
          {
            this.alert.showAlert();
            this.ifRegister = true;
            this.user.hideForm = true;
          }
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


  async presentModal() {
    const modal = await this.modal.create(
      ModalPage
    );
   modal.present();
  }


  //if the user press on home page button and he didn't finish fill the form
  click_home()
  {
    const db = firebase.firestore();
    if(this.ifRegister) //if the user is allready register check if there is his document in firebase
    {
        db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result => {
            if (!result.exists)
              this.alert.error_showAlert()
          }).catch(error => console.log(error))
      }
    else
    {
      this.init_arrays()
      this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'IDlogged':this.IDlogged , 'organization':this.user.organization})
    }
  }


  moreContact()
  {
    if(!this.hideMoreContact)
      this.hideMoreContact = true
    else
      this.hideMoreContact = false
  }

  
  modalFunc()
  {
    var x = document.getElementById("Modal");
    if(!this.showModal)
    {
      this.showModal = true
      if (x.className === "modal label label-md red") 
        x.className = "modal label label-md";
      this.presentModal()
    }
    else
      this.showModal = false
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
    var phoneRe =  /^\(?(0[2,3,4,8,9]{1})\)?([0-9]{7})$/;
    var digits = phone.replace(/[-.]/g, "");
    return phoneRe.test(digits);
  }
  
 

  legalID(numberID)
  {
    var temp = 0;
    var ID = new String(numberID)

    while (ID.length < 9) 
        ID = "0" + ID;

    for (var i = 0; i < 8; i++)
    {
      var y;
      var x = (((i%2) + 1) * Number(ID.charAt(i)));
      
        if (x > 9)
        {
          y = String(x)
          x = Number(y.charAt(0)) + Number(y.charAt(1))
        }
      temp += x;
    }
    
    if ((temp + Number(ID.charAt(8))) % 10 == 0) {
       console.log("ID IS OK");
      return true;
    } 
    else {
      console.log("ID IS NOT OK")
      return false;
    }
  }

  

  //check that all user inputs are legal
  check_field_value()
  {
    let flag = 0;
    let phone =  "0" + this.user.phone;
    let contact = "0" + this.user.contact

    setTimeout(() => 
    {
      if (this.user.fullName == null && !this.user.elderly)
      {
          this.alert.error_emptyFullName();
          flag = 1;
      }
  
      else if (!this.user.elderly && (typeof (this.user.email) == null || !this.validateEmail(this.user.email))) {
        this.alert.error_illegalEmail()
        flag = 1;
      }

      else if (this.user.onBehalf && this.user.email == null)
      {
       this.alert.error_illegalEmail()
         flag = 1;
      }
  
      else if (typeof (this.user.phone) === "undefined" ||
       (!this.validateCellPhoneNumber(phone) && !this.validatePhoneNumber(phone))) {
        this.alert.error_emptyPhone()
        flag = 1;
      }

  
      else if (!this.user.elderly && (this.user.id == null || !this.legalID(String(this.user.id))))
      {
           this.alert.showError_studentID()
            flag = 1;       
      }
  
      // else if (this.selectedNH == null || typeof(this.user.street) === "undefined")
      // {
      //   this.alert.showError_address();
      //   flag = 1;
      // }

 
      else if (this.user.onBehalf && (this.user.nameAssistant == null || this.user.contact == null
         ||(!this.validateCellPhoneNumber(contact) && !this.validatePhoneNumber(contact))))
      {
        this.alert.showError_behalf();
         flag = 1;
      }


  
      else if(this.user.onBehalf && (this.relationship_ == null && this.orgi == null))
      { 
         this.alert.showError_relationship();
         flag = 1;
      }
    
      else if((this.showOtherR && this.user.relationName == null) || (this.showOtherO && this.user.orgName == null))
      { 
         this.alert.showError_otherField();
         flag = 1;
      }
  
      // else if (!this.user.elderly && this.user.range == 0)
      // {
      //   this.alert.showAlert_chooseRange()
      //   flag = 1;
      // }

      else if (this.user.student && this.user.college == null)
      {
         this.alert.showError_studentDetails();
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

  
      else if (this.check_arrayVaule(this.hobbies) == 1) {
        this.alert.error_hobbies();
        flag = 1;
      }
  
  
      else if (this.check_arrayVaule(this.language) == 1) {
        this.alert.showError_language();
        flag = 1;
      }
  
      else if (this.check_arrayVaule(this.dayOfMeeting) == 1)
      {
        this.alert.showError_dayOfMeeting();
        flag = 1;
      }
      
  
      else if (!this.user.elderly && !this.user.student && this.numOfMeeting_ == null)
      {
          this.alert.error_numOfMeeting();
          flag = 1;
      }

      else if (this.check_arrayVaule(this.hours) == 1)
      {
          this.alert.error_hours();
          flag = 1;
      }

      // else if (!this.user.elderly && this.selectedFav == null) {
      //   this.alert.showError_favoriteN();
      //   flag = 1;
      // }

      else if(!this.showModal)
      {
        var x = document.getElementById("Modal");
        if (x.className === "modal label label-md") 
        x.className += " red";
        flag = 1;
      }

      if (flag == 0)
      {
        if(this.meetingWith_ == null)
          this.meetingWith_ = 1
        if (this.user.fullName == null && this.user.elderly)
        this.user.fullName = 'חסוי'

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
    if (this.user.onBehalf === false)
      this.user.onBehalf = true;
    else
    {
      this.user.onBehalf = false;
      this.user.contact = null;
      this.user.nameAssistant = null;
      this.user.relationName = null; 
      this.familyMember = null 
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
    //arrange date
    this.date = new Date().toISOString().substring(0, 10);
    this.user.dateTime = this.date[8] + this.date[9] + "-" +this.date[5] + this.date[6] + "-"
      + this.date[0] + this.date[1]+this.date[2] + this.date[3];

    const db = firebase.firestore();
    db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).set(
      {
        fullName: this.user.fullName,
        address: this.fixedAddress,
        phone: this.user.phone,
        email: this.user.email,
        // range: this.user.range,
        age: this.user.age,
        student: this.user.student,
        college: this.user.college,
        city: this.user.city,
        street: this.user.street,
        neighborhood: this.selectedNH,
        id: this.user.id,
        num_of_meetings: this.numOfMeeting_,
        hours: this.hours,
        meetingWith: this.meetingWith_,
        dateTime : this.user.dateTime ,
        date: this.date,
        gender: this.gender_,
        language: this.language,
        hobbies: this.hobbies,
        favoriteNegibrhood: this.selectedFav,
        dayOfMeeting: this.dayOfMeeting,
        musical_instrument: this.musical_instrument,
        musicStyle: this.musicStyle,
        hideMusic: this.user.hideMusic,
        status: 0,
        matching: null,
        rejected: null,
        adminComments: this.user.comments
      })
      .then(() => {
        if(this.user.loggedIn)
          this.alert.showAlertUpdateDetails()
        else
          this.alert.showAlertSuccess();
          
        this.init_arrays()
        this.navCtrl.setRoot(HomePage ,{'login':this.user.loggedIn})
      }).catch((error) => {
        console.log(error)
      })
  }


  
  get_data_fromFirebase_org()
  {
    const db = firebase.firestore();

    db.collection('organizations').doc(firebase.auth().currentUser.uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.email = result.data().email,
      this.user.nameAssistant = result.data().contactName
      this.user.contact = result.data().contactPhone
      this.user.orgName = result.data().organizationName
    
      console.log('this.user.orgNameIN',this.user.orgName)

    }).catch(error => {console.log(error)}).then(result =>{

    console.log('this.user.orgName',this.user.orgName)

    
    this.array.organization.forEach(element => {
     if(element.species == this.user.orgName){
      console.log('element.species 1 :',element.species)

      element.currentValue = true
      this.user.onBehalf = true;
     }
     else if(element.species == 'אחר' && this.user.onBehalf == false ){
      console.log('element.species 1 :',element.species)

      element.currentValue = true
      this.user.onBehalf = true;
     }
     
   });
   console.log('this.user.orgName',this.user.orgName)

   console.log('this.array.organization',this.array.organization)
  });
  }

  
  getData_fromFirebaseVol()
  {
    const db = firebase.firestore();

    db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.fullName = result.data().fullName
      this.user.phone = result.data().phone
      this.user.email = result.data().email
      this.hobbies = result.data().hobbies
      this.language = result.data().language
      this.dayOfMeeting = result.data().dayOfMeeting
      this.musicStyle = result.data().musicStyle
      // this.user.range = result.data().range,
      this.user.age = result.data().age
      this.user.id = result.data().id
      this.user.student = result.data().student
      this.user.college = result.data().college
      this.musical_instrument = result.data().musical_instrument
      this.meetingWith_ = result.data().meetingWith
      this.numOfMeeting_ = result.data().num_of_meetings
      this.hours = result.data().hours
      this.gender_ = result.data().gender
      this.user.city = result.data().city
      this.user.street = result.data().street
      this.selectedNH = result.data().neighborhood,
      this.user.hideMusic = result.data().hideMusic
      this.selectedFav = result.data().favoriteNegibrhood
      this.radioClicked_fromDB(this.meetingWith, this.meetingWith_)
      this.radioClicked_fromDB(this.numOfMeeting, this.numOfMeeting_)
      this.radioClicked_fromDB(this.hours, this.hours_)
      this.radioClicked_fromDB(this.gender, this.gender_)

    }).catch(error => {console.log(error)})
 
  }


  arrangeAddress()
  {
    let temp = ""
    if(this.selectedNH != null)
      temp = this.selectedNH.species + ", "
    if(this.user.street != null)
      temp += this.user.street + ", "
    if (this.user.city != null)
      temp += " " + this.user.city

    if(temp == "")
      temp = "לא צויין"

    this.fixedAddress =  temp
  }


  add_data_to_firebase_Elderly()
  {
    this.arrangeAddress();
    //arrange date
    this.date = new Date().toISOString().substring(0, 10);
    this.user.dateTime = this.date[8] + this.date[9] + "-" +this.date[5] + this.date[6] + "-"
     + this.date[0] + this.date[1]+this.date[2] + this.date[3];
    
    if(this.hideMoreContact)
      this.add_familyMembers();

    const db = firebase.firestore();
    db.collection('ElderlyUsers').doc().set(
      {
        matching:{id: "", grade: 0, date: ""},
        fullName: this.user.fullName,
        address: this.fixedAddress,
        city: this.user.city,
        street: this.user.street,
        neighborhood: this.selectedNH,
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
        date: this.date,
        description: this.user.description,
        meetingWith: this.meetingWith_,
        relationship: this.relationship_,
        hobbies: this.hobbies,
        musicStyle: this.musicStyle,
        language: this.language,
        dayOfMeeting: this.dayOfMeeting,
        hours: this.hours,
        familyMember: this.familyMember,
        adminComments: this.user.comments
      })
      .then(() => {
        this.alert.showAlertSuccess();
        this.init_arrays()
        this.navCtrl.setRoot(HomePage)
      }).catch((error) => {
        console.log(error)
      })
  }


    //init all arrays for 'false' value
    init_arrays()
    {
      this.init(this.hobbies)
      this.init(this.numOfMeeting)
      this.init(this.hours)
      this.init(this.gender)
      this.init(this.musicStyle)
      this.init(this.language)
      this.init(this.meetingWith)
      this.init(this.musical_instrument)
      this.init(this.dayOfMeeting)
      this.init(this.organization)
      this.init(this.neighborhoods)
      this.init(this.relationship)
      this.selectedFav = null
    }
  
  
    init(arr)
    {
      for(let i = 0 ; i < arr.length ; i++)
        arr[i].currentValue = false
    }
  

  //---------------------- checkbox and radio functions ------------------------

  CheckboxClicked1(item: any, arr)
  {

    this.CheckboxClicked(item, arr)
    if(this.hobbies[2].currentValue)
      this.user.hideMusic = true;
    else
    {
      this.cancelCheckBox(this.musicStyle)
      this.cancelCheckBox(this.musical_instrument)
      this.user.hideMusic = false;
    }
    

    //for hours - of chose "כל שעה ביום"
    if(this.hours[0].currentValue)
    {
      for(let i = 1 ; i < this.hours.length; i++)
        this.hours[i].currentValue = true;
    }
    else if(!this.hours[0].currentValue)
    {
      for(let i = 1 ; i < this.hours.length; i++)
        this.hours[i].currentValue = false;
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

  selectVol_neighborhood(event:{component: SelectSearchableComponent, value:any})
  {
    for(let i = 0 ; i < event.value.length; i++)
      this.selectedFav[i].currentValue = true

      console.log(this.selectedFav)
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
  

  // radioClicked1(item: any, $event) {
  //   this.radioClicked(item, this.time)
  // }
 radioClicked1(item: any, $event) {
    this.hours_ = item.id
    this.radioClicked(item, this.hours)
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
  

  radioClicked_fromDB(arr,item)
  {
    for (let i = 0; i < arr.length; i++)
    {
      if (arr[i].id === item)
        arr[i].currentValue =  true
    }
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

}


