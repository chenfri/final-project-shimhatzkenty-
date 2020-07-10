import { Component } from '@angular/core';
import { IonicPage,ViewController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import firebase from 'firebase';
import { Arrays } from '../../providers/arrays'


@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  user = {} as User;

 
  public familyMember: any[]; gender: any[] ; musicStyle: any[]; address: any[];
  public language: any[] ; meetingWith: any[] ;musical_instrument: any[]
  public dayOfMeeting: any[] ; neighborhoods: any[]
  public hobbies: any[] ; time: any[] ; numOfMeeting: any[]; hours: any[];
  public relationship: any[];  organization: any[] ; 
  public selectedFav : any ; selectedNH : any; orgi : any;
  public volunteer: any;


  uid = null;
  userType =  null;

  constructor(public array:Arrays, public navParams: NavParams, public viewCtrl: ViewController)
  {

   //update variables
   this.selectedFav = null
   this.selectedNH = null
   this.volunteer= false
   this.user.orgName = null
   this.user.city = null
   this.user.nameAssistant = null
   this.user.relationName = null
   this.user.college = null
   this.user.id = null
   this.user.contact = null
   this.user.description = null
   this.user.age = null
   this.user.dateTime = null
   this.familyMember = null
   this.user.fullName = null
   this.user.hideMusic = false
   this.user.student = false
   this.user.onBehalf = false
   this.user.numOfAssistant = 0
   this.orgi = 0
   this.user.onBehalf = false
   this.user.nameAssistant = null
   this.user.relationName = null
   this.user.description = null

   this.hobbies = this.array.hobbies
   this.numOfMeeting = this.array.numOfMeeting
   this.hours = this.array.hours
   this.gender = this.array.gender
   
   this.musicStyle = this.array.musicStyle
   this.language = this.array.language
   this.meetingWith = this.array.meetingWith
   this.musical_instrument = this.array.musical_instrument
   this.dayOfMeeting = this.array.dayOfMeeting
   this.organization = this.array.organization
   this.neighborhoods = this.array.neighborhoods
   this.relationship = this.array.relationship

  this.uid = this.navParams.get('uid');
  this.userType = this.navParams.get('userType');

  this.getDataFromFirebase(this.uid , this.userType);
}


  close(){
    this.viewCtrl.dismiss();
  }


  getDataFromFirebase(uid, userType)
  {
    if(userType == "volunteer")
    {
      this.getData_fromFirebaseVol(uid);
      this.volunteer= true;
    }

    else if(userType == "elderly")
    {
      this.volunteer = false;
      this.getData_fromFirebaseElderlyUsers(uid);
    }

  }
  

  getData_fromFirebaseVol(uid)
  {
    const db = firebase.firestore();

    db.collection('volunteerUsers').doc(uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.fullName = result.data().fullName
      this.user.phone = result.data().phone
      this.user.email = result.data().email
      this.hobbies = result.data().hobbies
      this.language = result.data().language
      this.dayOfMeeting = result.data().dayOfMeeting
      this.musicStyle = result.data().musicStyle
      this.user.age = result.data().age
      this.user.id = result.data().id
      this.user.student = result.data().student
      this.user.college = result.data().college
      this.musical_instrument = result.data().musical_instrument
      this.meetingWith = result.data().meetingWith
      this.numOfMeeting = result.data().num_of_meetings
      this.hours = result.data().hours
      this.gender = result.data().gender
      this.address = result.data().address
      this.user.dateTime = result.data().dateTime
      this.user.hideMusic = result.data().hideMusic
      this.selectedFav = result.data().favoriteNegibrhood

    }).catch(error => {console.log(error)})
 
  }

  getData_fromFirebaseElderlyUsers(uid)
  {
    const db = firebase.firestore();

    db.collection('ElderlyUsers').doc(uid).get()
    .then(result => {
      if (!result.exists) return
      this.user.fullName = result.data().fullName
      this.user.phone = result.data().phone
      this.user.email = result.data().email
      this.hobbies = result.data().hobbies
      this.language = result.data().language
      this.dayOfMeeting = result.data().dayOfMeeting
      this.musicStyle = result.data().musicStyle
      this.musical_instrument = result.data().musical_instrument
      this.meetingWith = result.data().meetingWith
      this.hours = result.data().hours
      this.gender = result.data().gender
      this.address = result.data().address
      this.user.dateTime = result.data().dateTime
      this.user.hideMusic = result.data().hideMusic;
      this.user.onBehalf = result.data().behalf;
      this.user.nameAssistant = result.data().nameAssistant;
      this.user.relationName = result.data().relationName;
      this.relationship = result.data().relationship;
      this.user.description = result.data().description;
      this.user.contact = result.data().contact;
      this.orgi = result.data().orgi;
      this.user.orgName = result.data().orgName;

    }).catch(error => {console.log(error)})
 
  }

}
