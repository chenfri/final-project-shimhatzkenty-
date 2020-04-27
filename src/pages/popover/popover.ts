import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import firebase from 'firebase';
import { Arrays } from '../../providers/arrays'

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  user = {} as User;

  // public hobbies_ = new Array(); hours_ = new Array();organization_= new Array() ; gender_ = new Array();
  // public meetingWith_ = new Array(); numOfMeeting_ = new Array();  relationship_= new Array() ; 
  // public place_= new Array(); musicStyle_ = new Array(); language_ = new Array(); 
  // public dayOfMeeting_ = new Array();neighborhoods_= new Array();

 
  public familyMember: any[]; gender: any[] ; musicStyle: any[]; address: any[];
  public language: any[] ; meetingWith: any[] ;musical_instrument: any[]
  public dayOfMeeting: any[] ; organization: any[] ; neighborhoods: any[]
  public hobbies: any[] ; time: any[] ; numOfMeeting: any[]; hours: any[];
  public place: any[] ; relationship: any[]
  public selectedFav : any ; selectedNH : any; orgi : any;

  uid = null;

  constructor(public array:Arrays,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
   //update variables
   this.selectedFav = null
   this.selectedNH = null
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
   this.orgi = null



   this.hobbies = this.array.hobbies
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

  this.uid = this.navParams.get('uid');
  console.log('uid: ',this.uid)
  this.getData_fromFirebaseVol(this.uid);
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  close(){
    this.viewCtrl.dismiss();
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
      // this.user.range = result.data().range,
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
      console.log(this.address)
      this.user.dateTime = result.data().dateTime
      // this.user.city = result.data().city
      // this.user.street = result.data().street
      // this.selectedNH = result.data().neighborhood
      this.user.hideMusic = result.data().hideMusic
      this.selectedFav = result.data().favoriteNegibrhood
      // this.getSpeciesfromDB(this.hobbies)

 
    }).catch(error => {console.log(error)})
 
  }
  // getSpeciesfromDB(arr)
  // {
  //   for (let i = 0; i < arr.length; i++)
  //   {

  //     if (arr[i].currentValue === true){
  //       this.hobbies_.push(arr[i].species);
  
  //     }
  //   }
  // }
}
