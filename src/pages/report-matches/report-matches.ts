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
  matchesNotFoundList: { elderlyIdDoc: any,volIdDoc: any, grade: any }[] =[] ;
  notConfirmedMatchesList: { elderlyIdDoc: any,volIdDoc: any, grade: any }[] =[] ;
  acceptedMatchesList: { elderlyIdDoc: any,volIdDoc: any, grade: any }[] =[] ;
  MeetingList: { elderlyIdDoc: any,volIdDoc: any, grade: any }[] =[] ;
  RejectedMatch: { elderlyIdDoc: any,volIdDoc: any, grade: any }[] =[] ;

  IDlogged:any;

  // matchesNotFoundList = new Array(); 
  // notConfirmedMatchesList= new Array(); 
  // acceptedMatchesList= new Array(); 
  // MeetingList= new Array(); 
  // RejectedMatch= new Array(); 
  
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
 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportMatchesPage');
  }

  getDataToLists(){
    const db = firebase.firestore();
    var elderlyIdDoc:number;
    var volIdDoc:string;
    var k = 0 ;

    for(var iE=0 ; iE<this.userE.length ; iE++){
      if(this.userE[iE].matching[0] != ""){
        volIdDoc = this.userE[iE].matching[0];

        for(var iV=0 ; iV<this.userV.length;iV++){
          if(this.userV[iV].docID == volIdDoc){
      
            if(this.userV[iV].status == 0)
              this.matchesNotFoundList.push({elderlyIdDoc: this.userE[iE].name ,volIdDoc: this.userV[iV].name , grade: this.userE[iE].matching[1] })
            
            else if(this.userV[iV].status == 1)
              this.notConfirmedMatchesList.push({elderlyIdDoc: this.userE[iE].name ,volIdDoc: this.userV[iV].name , grade: this.userE[iE].matching[1] })
      
            else if(this.userV[iV].status == 2)
              this.acceptedMatchesList.push({elderlyIdDoc: this.userE[iE].name ,volIdDoc: this.userV[iV].name , grade: this.userE[iE].matching[1] })
       
            else if(this.userV[iV].status == 3)
              this.RejectedMatch.push({elderlyIdDoc: this.userE[iE].name ,volIdDoc: this.userV[iV].name , grade: this.userE[iE].matching[1] })

            else if(this.userV[iV].status == 4)
              this.MeetingList.push({elderlyIdDoc: this.userE[iE].name ,volIdDoc: this.userV[iV].name , grade: this.userE[iE].matching[1] })
         
          }

        }
      }
    }
    // matchesNotFoundList: { elderlyIdDoc: number,vollyIdDoc: number, grade: number }[] ;
    // notConfirmedMatchesList: { elderlyIdDoc: number,vollyIdDoc: number, grade: number }[] ;
    // acceptedMatchesList: { elderlyIdDoc: number,vollyIdDoc: number, grade: number }[] ;
    // MeetingList: { elderlyIdDoc: number,vollyIdDoc: number, grade: number }[] ;
    // RejectedMatch: { elderlyIdDoc: number,vollyIdDoc: number, grade: number }[] ;
  
    // for(var i=0 ; i<this.userV.length;i++){
      
    //   if(this.userV[i].status == 0)
    //     this.matchesNotFoundList.push(i)
    //   else if(this.userV[i].status == 1)
    //     this.notConfirmedMatchesList.push(i) 
    //   else if(this.userV[i].status == 2)
    //     this.acceptedMatchesList.push(i)
    //   else if(this.userV[i].status == 3)
    //     this.RejectedMatch.push(i)
    //   else if(this.userV[i].status == 4)
    //     this.MeetingList.push(i)     

    //   console.log('status: ', this.userV[i].status , i)




    // }

  }  
  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

}
