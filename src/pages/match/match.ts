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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) { 
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');


    console.log('admin: ', this.user.Admin , 'loggedIn: ', this.user.loggedIn ,
                this.userE , this.userV  )

    // console.log( 'userE[1][16] ' ,this.userE[1][16][0] , 'userE[1][16][0]' ,this.userE[1][16][0])

    this.getVolunteerNumbers();

    console.log('numbers' , this.numbers)

    }

    getVolunteerNumbers(){

      
      for(var i=0; i<this.userE.length;i++){
        var volID = this.userE[i][16][0];

        for(var j=0 ; j<this.userV.length;j++){

          var index = this.userV[j][4].localeCompare(volID)
          if(this.userV[j][4].localeCompare(volID) == 0){
              this.numbers.push(this.userV[j][5]); 
        }   
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

  deleteMatch(idE){
    const db = firebase.firestore();    
   
    db.collection("ElderlyUsers").doc(idE).update({
       match: null
    }) 
    
  }

  
}
