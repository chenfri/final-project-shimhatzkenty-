import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { User } from '../../module/User';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { PopoverPage } from '../popover/popover';

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
  matchesNotFoundList: { elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  notConfirmedMatchesList: { elderlyIdDoc: any,volIdDoc: any }[] =[] ;
  acceptedMatchesList: { elderlyIdDoc: any,volIdDoc: any }[] =[] ;
  MeetingList: { elderlyIdDoc: any,volIdDoc: any }[] =[] ;
  RejectedMatch: { elderlyIdDoc: any,volIdDoc: any ,cancelDescription: any}[] =[] ;

  IDlogged:any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  
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
    var volIdDoc:string;
    var k = 0 ;
    var description = "";

    for(var iE=0 ; iE<this.userE.length ; iE++){
      if(this.userE[iE].matching[0] != ""){
        volIdDoc = this.userE[iE].matching[0];

        for(var iV=0 ; iV<this.userV.length;iV++){
          if(this.userV[iV].docID == volIdDoc){
      
            if(this.userV[iV].status == 0)
              this.matchesNotFoundList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index })
            
            else if(this.userV[iV].status == 1)
              this.notConfirmedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index  })
      
            else if(this.userV[iV].status == 2)
              this.acceptedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index  })
       
            else if(this.userV[iV].status == 3){
              db.collection("volunteerUsers").doc(this.userV[iV].docID).get().then(result => {
                if (!result.exists) return
                description = result.data().cancelDescription;
              }).catch(error => {console.log(error)})
              this.RejectedMatch.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index , cancelDescription: description})
              console.log("cancelDescription" , description)
            }
            else if(this.userV[iV].status == 4)
              this.MeetingList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index  })
         
          }
          else if(this.userV[iV].status == 3){
            db.collection("volunteerUsers").doc(this.userV[iV].docID).get().then(result => {
              if (!result.exists) return
              description = result.data().cancelDescription;
            }).catch(error => {console.log(error)})
            this.RejectedMatch.push({elderlyIdDoc: this.userV[iV].rejected[0] ,volIdDoc: this.userV[iV].index , cancelDescription: description})
            console.log("cancelDescription" , description)
          }

        }

        if(this.userE[iE].status == 0)
          this.matchesNotFoundList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: 0 })


      }
    }
   

  }  
    // modal for get 'more details' about the users
    async openPopover(event , uid, userType)
    {
      console.log("openPopover")
      let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType });
      popover.present({
        ev: event
      });
    }
  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

}
