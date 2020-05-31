import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User';
import { HomePage } from '../home/home';
import firebase from 'firebase';

/**
 * Generated class for the ReportMatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-matches',
  templateUrl: 'report-matches.html',
})
export class ReportMatchesPage {

  user = {} as User
  userE : any[]
  userV : any[]
  IDlogged:any;

  matchesNotFoundList = new Array(); 
  notConfirmedMatchesList= new Array(); 
  acceptedMatchesList= new Array(); 
  MeetingList= new Array(); 
  RejectedMatch= new Array(); 
  
  ElderlymatchesNotFoundList = new Array(); 
  ElderlynotConfirmedMatchesList= new Array(); 
  ElderlyacceptedMatchesList= new Array(); 
  ElderlyMeetingList= new Array(); 
  ElderlyRejectedMatch= new Array(); 
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)
    console.log('this.IDlogged', this.IDlogged)
    
    this.getDataToLists();

    
    console.log('matchesNotFoundList: ',this.matchesNotFoundList)
    console.log('notConfirmedMatchesList: ',this.notConfirmedMatchesList)
    console.log('acceptedMatchesList: ', this.acceptedMatchesList)
    console.log('meetingList: ', this.MeetingList)
    console.log('RejectedMatch: ',this.RejectedMatch)
 
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportMatchesPage');
  }

  getDataToLists(){
    const db = firebase.firestore();
    var elderlyIdDoc:number;

    for(var i=0 ; i<this.userV.length;i++){
      
      if(this.userV[i].status == 0)
        this.matchesNotFoundList.push(i)
      else if(this.userV[i].status == 1)
        this.notConfirmedMatchesList.push(i) 
      else if(this.userV[i].status == 2)
        this.acceptedMatchesList.push(i)
      else if(this.userV[i].status == 3)
        this.RejectedMatch.push(i)
      else if(this.userV[i].status == 4)
        this.MeetingList.push(i)     

      console.log('status: ', this.userV[i].status , i)




    }

  }  
  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

}
