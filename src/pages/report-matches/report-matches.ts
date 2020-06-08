import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { User } from '../../module/User';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { PopoverPage } from '../popover/popover';

@IonicPage()
@Component({
  selector: 'page-report-matches',
  templateUrl: 'report-matches.html',
})
export class ReportMatchesPage {

  user = {} as User
  userE : any[]
  userV : any[]
  matchesFoundList :{elderlyIdDoc: any,volIdDoc: any}[] =[] 
  matchesNotFoundList: any[] =[] ;
  notConfirmedMatchesList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  acceptedMatchesList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  MeetingList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  RejectedMatch: {volName: any,  volIdDoc: any, elderlyName: any,  elderlyIdDoc: any,  reason: any}[] =[] ;
  IDlogged:any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)

    for(let i = 0 ;i < this.userE.length ;i++)
    {
      let date = this.userE[i].matching.date

      if(this.userE[i].matching.meetingDate)
      {
        let date2 = this.userE[i].matching.meetingDate
        this.userE[i].matching.meetingDate = date2[8] + date2[9] + "-" + date2[5] + date2[6] + "-"
        + date2[0] + date2[1]+ date2[2] + date2[3]
      }
  

      this.userE[i].matching.date = date[8] + date[9] + "-" + date[5] + date[6] + "-"
      + date[0] + date[1]+ date[2] + date[3];
    }
   
    this.getDataToLists();

    console.log('matchesNotFoundList: ',this.matchesNotFoundList)
    console.log('notConfirmedMatchesList: ',this.notConfirmedMatchesList)
    console.log('acceptedMatchesList: ', this.acceptedMatchesList)
    console.log('meetingList: ', this.MeetingList)
    console.log('RejectedMatch: ',this.RejectedMatch)
    console.log('matchesFoundList: ',this.matchesFoundList)
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportMatchesPage');
  }



  getDataToLists()
  {
    var volIdDoc, volName;

    for(var iV = 0 ; iV < this.userV.length; iV++) // for rejected matched table
    {
      if(this.userV[iV].rejected != null)
      {
        volName = this.userV[iV].name
        this.userV[iV].rejected.forEach(element => {
          for(var iE = 0 ; iE < this.userE.length ; iE++)
          {
            if(element.id == this.userE[iE].docID)
              this.RejectedMatch.push(
              {
                  volName: volName,
                  volIdDoc: this.userV[iV].docID,
                  elderlyName: this.userE[iE].name,
                  elderlyIdDoc: this.userE[iE].docID,
                  reason: element.reason
              })
          }});
      }
    }


    for(var iE = 0 ; iE < this.userE.length ; iE++)
    {
      if(this.userE[iE].status == 0) // elderly not found for them matching
        this.matchesNotFoundList.push(this.userE[iE].index)
    
      else if(this.userE[iE].matching.id != "")
      {
        volIdDoc = this.userE[iE].matching.id;

        for(var iV = 0 ; iV < this.userV.length; iV++)
        {
          if(this.userV[iV].docID == volIdDoc)
          {
            this.matchesFoundList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})

            if(this.userV[iV].status == 1)
              this.notConfirmedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})
      
            else if(this.userV[iV].status == 2)
              this.acceptedMatchesList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})

            else if(this.userV[iV].status == 4)
              this.MeetingList.push({elderlyIdDoc: this.userE[iE].index ,volIdDoc: this.userV[iV].index})

            break;
          }
        }
      }
   } 
  }  



    // modal for get 'more details' about the users
    async openPopover(event , uid, userType)
    {
      console.log("openPopover")
      let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType },{cssClass: 'custom-popover'});
      popover.present({
        ev: event
      });
    }
  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }

}
