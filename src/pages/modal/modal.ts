import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { NavParams, PopoverController} from 'ionic-angular';
import {AlertProvider} from '../../providers/alert/alert'
import { PopoverPage } from '../popover/popover';
import firebase from 'firebase';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})

export class ModalPage {
  public whichPage: string;
  public parameters: any[];
  waitingForAdminAcceptList: {elderlyIdDoc: any,volIdDoc: any}[] =[] ;
  userE : any[]
  userV : any[]

  constructor(public navParams: NavParams, params: NavParams,private modal: ViewController, public alert: AlertProvider,public popoverCtrl: PopoverController) {
    this.whichPage = params.get('whichPage')
    console.log('whichPage', this.whichPage);


    this.userE =  this.navParams.get('userE');
    console.log('userE: ', this.userE);

    this.userV =  this.navParams.get('userV');
    console.log('userV: ', this.userV);

    if(this.whichPage == "matchAccept")
        this.getWaitingList()

    console.log("listtt: ", this.waitingForAdminAcceptList)

    this.parameters = [{
      'species': 'ימים',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שעות',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'מעוניין להיפגש עם',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'תחומי עניין',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שפות',
      'currentValue': false,
      'Threshold' : false
    }]

  }

  getWaitingList(){
    var volIdDoc;

    for(var iE = 0 ; iE < this.userE.length ; iE++)
    {
      if(this.userE[iE].status == -1)
      {
        volIdDoc = this.userE[iE].matching.id;

        for(var iV = 0 ; iV < this.userV.length; iV++)
        {
          if(this.userV[iV].docID == volIdDoc){
              this.waitingForAdminAcceptList.push({elderlyIdDoc: iE ,volIdDoc: iV})
              console.log("name VO: ", this.userV[iV].name )
              console.log("name El: ", this.userE[iE].name )
              break;
          }
        }
      }
      }
  }


  adminAcceptence(match , type)
  {
    console.log('matchToaccept:  ', match)
    const db = firebase.firestore();

    if(type == "accept")
    {

      
      db.collection('ElderlyUsers').doc(this.userE[match.elderlyIdDoc].docID).update(
      {
          matching: this.userE[match.elderlyIdDoc].matching,
          status: 1
        }).catch((error) => {console.log(error)})
        
        
      db.collection('volunteerUsers').doc(this.userV[match.volIdDoc].docID).update(
      {
        matching: this.userE[match.elderlyIdDoc].docID,
        status: 1
      }).catch((error) => {console.log(error)})


      this.userE[match.elderlyIdDoc].status = 1

    //this.sendEmailsVolunteer(this.userV[match.volIdDoc].name, this.userV[match.volIdDoc].email)
    // if(this.userE[i].email != null)
    //   this.sendEmailsElder(this.userE[i].nameAssistant, this.userE[i].name, "this.userE[i].nameVthis.userE[i].email")
    //if(this.userV[match.volIdDoc].phone.length == 9)
    //this.sendSMS("+972" + this.userE[i].matching.phoneV, this.userE[i].matching.name)
      }
    

    else if(type == "reject")
    {
      db.collection("volunteerUsers").doc(this.userV[match.volIdDoc].docID).update({
        status: 0,
        matching: null,
      }).catch(error => {console.log(error)}) 
    
    
      db.collection("ElderlyUsers").doc(this.userE[match.elderlyIdDoc].docID).update({
        matching:{id: "", grade: 0, date: ""},
        status: 0
      }).catch(error => {console.log(error)})

      this.userE[match.elderlyIdDoc].status = 0
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
  async closeModal()
  {
    this.modal.dismiss("closed")
  }



  async passParams()
  {
    let chosen = false
    for(let i = 0 ; i < this.parameters.length; i++)
      if(this.parameters[i].currentValue)
        chosen = true

    if(!chosen)
      this.alert.error_params();
    else
      this.modal.dismiss(this.parameters );
  }

  
  radioClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(!element.Threshold && element.currentValue)
          element.Threshold = true
        else
          element.Threshold = false
      }
    });

    console.log('parameters',this.parameters) 
  }


  CheckboxClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(element.currentValue)
          element.currentValue = false
        else
          element.currentValue = true
      }
    });

    //console.log('parameters',this.parameters) 
  }
}