import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams} from 'ionic-angular';
import firebase, { firestore } from 'firebase';

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  currentEvent:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) 
  { }

  user = {} as User;
  public hobbies: any[] 
  public time: any[]
  public numOfMeeting: any[]

  

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
  
}
