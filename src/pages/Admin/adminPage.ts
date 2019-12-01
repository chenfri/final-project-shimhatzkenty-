import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams} from 'ionic-angular';
import firebase, { firestore } from 'firebase';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  
  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
   this.get_data_from_firebase();
    //console.log(this.temp)
   }

  user = {} as User;
  public hobbies: any[] 
  public time: any[]
  public numOfMeeting: any[]


  get_data_from_firebase()
  {
    let tmp =[]
    let i = 0
    const db = firebase.firestore();
    db.collection("ElderlyUsers").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          tmp[i] = doc.data()
          console.log(tmp[i])
          i++
       });
   //    console.log(this.temp)
      // return tmp
       
  });
   /* const result = db.collection('ElderlyUsers').get().then(res =>
    {
         res.forEach(i => {console.log(i.data())})
    
    })*/
  }
  
}
