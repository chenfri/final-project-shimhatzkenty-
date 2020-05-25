import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { User } from '../../module/User';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})
export class MatchPage {

  user = {} as User
  userE : any[]
  userV : any[]
  public numbers = new Array(); 
  IDlogged:any;
  acceptedMatch : boolean;
  showMatch:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) { 
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)

    if(!this.user.Admin)
      this.statusManagement();

    // this.acceptedMatch = false; 

    console.log('this.IDlogged', this.IDlogged)

    console.log('admin: ', this.user.Admin , 'loggedIn: ', this.user.loggedIn ,
                this.userE , this.userV  )

    console.log( 'userE[1][16] ' ,this.userE[1][16][0] , 'userE[1][16][0]' ,this.userE[1][16][0])

    this.showMatch = false


    this.getVolunteerNumbers();

    console.log('numbers' , this.numbers)
    

    }

    statusManagement(){
      const db = firebase.firestore();       
   
      if(!this.user.status){
        db.collection("volunteerUsers").doc(this.IDlogged).get().then(result => {
          if (!result.exists) return
          this.user.status = result.data().status
        })
      }

    }

    getVolunteerNumbers(){

      
      for(var i=0; i<this.userE.length;i++){
        var volID = this.userE[i][16][0];
        var push = false;
        for(var j=0 ; j<this.userV.length;j++){
          var index = this.userV[j][4].localeCompare(volID)

          if(this.userV[j][4].localeCompare(volID) == 0){
              this.numbers.push(this.userV[j][5]); 
              push = true;
          }
        
        } 
        if(push == false)   {
            console.log("ENTER")
            this.numbers.push(-1); 
          }
      }
  
  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }
  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

  CancelMatch(idE){
    const db = firebase.firestore();    


    db.collection("ElderlyUsers").doc(idE).update({
       matching: null,
       status: 0
    }) 
    db.collection("volunteerUsers").doc(this.IDlogged).update({
      status: 3
   }) 
    
  }
  acceptMatch(idE){
    const db = firebase.firestore();       
    this.acceptedMatch = true;  
    db.collection("volunteerUsers").doc(this.IDlogged).update({
      status: 2
   }) 
   db.collection("ElderlyUsers").doc(idE).update({
      status: 2
 }) 

   
  }
  acceptedMeeting(idE){
    const db = firebase.firestore();       
   
    db.collection("volunteerUsers").doc(this.IDlogged).update({
      status: 4
   }) 
   db.collection("ElderlyUsers").doc(idE).update({
      status: 4
 }) 
  }

  
}
