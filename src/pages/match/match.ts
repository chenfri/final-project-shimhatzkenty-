import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { User } from '../../module/User';
import firebase from 'firebase';
import { AlertController} from 'ionic-angular';
import {AlertProvider} from '../../providers/alert/alert'


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
  cancelText: boolean;
  cancelDescription: string;
  nameLogged: string;
  indexOfLogged: string
  cancellationReason: boolean;
  rejArr :any[]
  meetingDate: any
  everyHour: boolean;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public alert:AlertProvider) { 
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)
    console.log(this.IDlogged)

    this.meetingDate = null
    this.cancelDescription = null; 
    this.acceptedMatch = false;
    this.cancelText = false
    this.everyHour=false;

    for(var i = 0 ; i < this.userV.length; i++){
 
      if(this.IDlogged == this.userV[i].docID)
      {
        this.nameLogged = this.userV[i].name
        this.indexOfLogged = this.userV[i].index
      }     
        
      }
    }


    
  ngOnInit()
  {
    this.getVolunteerNumbers();
    console.log('numbers' , this.numbers)
  }



  getVolunteerNumbers()
  {
    for(var i = 0; i < this.userE.length; i++)
    {
      if(this.userE[i].matching)
      {
        var volID = this.userE[i].matching.id;
        var push = false;

        for(var j = 0 ; j < this.userV.length; j++)
        {
          var index = this.userV[j].docID.localeCompare(volID)           
            if(this.userV[j].docID.localeCompare(volID) == 0 ){
            this.numbers.push(this.userV[j].index); 
              push = true; }
        } 
      }

      if(push == false)
          this.numbers.push(-1); }
}
  


//handle with add new record to dates of meeting table
  addNewDateToTable()
  {
    let temp = {number: "", date: "", idElder: this.userV[this.indexOfLogged].matching}
    let tempArr = []
    var tmp = this.userV[this.indexOfLogged].arrDates
    if(tmp != null)
      for(let i = 0 ; i < tmp.length; i++)
        tempArr.push(tmp[i])
    tempArr.push(temp)

    this.userV[this.indexOfLogged].arrDates = tempArr
  }


//save dates of meeting table
  saveNewDate()
  {
    const db = firebase.firestore(); 
    var tmp = this.userV[this.indexOfLogged].arrDates
    console.log(tmp)
    for(let i = 0 ; i < tmp.length; i++)
    {
      db.collection("volunteerUsers").doc(this.IDlogged ).update({
        arrDates: tmp
      }).catch(error => {console.log(error)}) 
    }

    this.alert.saveArrDates()
  }



  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin 
    , 'IDlogged':this.IDlogged }); 
  }


//handle with the case the volunteer ask for new matcing 
  findNewMatching(idV, idE)
  {
    const db = firebase.firestore(); 
    db.collection("volunteerUsers").doc(idV).update({
      matching: null,
      status: 0,
      dateSendRemider: ""
    }).catch(error => {console.log(error)}) 
  
  
    db.collection("ElderlyUsers").doc(idE).update({
      matching:{id: "", grade: 0, date: ""},
      status: 0
    }).catch(error => {console.log(error)}) 

    this.alert.showFindNewMatch();
  }



  CancelMatch(i)
  {

  let alert = this.alertCtrl.create({
    title: 'אזהרה',
    subTitle: 'האם את/ה בטוח/ה שברצונך לבטל את ההתאמה שנמצאה?' ,
    buttons: [
    {
      text: 'כן',
      role: 'cancel',
      handler: () => {
      console.log('yes clicked');
    
      this.cancelText = true        
      this.rejArr = null
      this.userV[i].status = 3   
    }
      },
      {
        text: 'לא',
        handler: () => {
          console.log('no clicked');
          this.cancelText = false;

        }
      }
    ]
  });
    alert.present();
  
  
}
  

//handle with the case that the volunteer denied the matching that found for him
updateRejected(idE, idV ,i)
{
  const db = firebase.firestore(); 

  if(!this.user.Admin && this.user.loggedIn)
      idV = firebase.auth().currentUser.uid

  this.alert.saveDeleteReason();

  this.rejArr = this.userV[i].rejected

  if(this.rejArr != null)
    this.rejArr =[...this.rejArr,{id: idE, reason: this.cancelDescription}]
  else
    this.rejArr =[{id: idE, reason: this.cancelDescription}]
    console.log(this.rejArr)

  this.userV[i].rejected = this.rejArr = this.rejArr

  db.collection("volunteerUsers").doc(idV).update({
    status: 0,
    matching: null,
    rejected:this.rejArr,
    dateSendRemider: ""
  }).catch(error => {console.log(error)}) 


  db.collection("ElderlyUsers").doc(idE).update({
    matching:{id: "", grade: 0, date: ""},
    status: 0
  }).catch(error => {console.log(error)}) 


  this.cancelText = false;
  this.cancellationReason = true;
}


//handle with the case that the volunteer accept the matching that found for him
  acceptMatch(idE , idV, i)
  {
    const db = firebase.firestore();       
    this.acceptedMatch = true;  
    if(idV == 0)
        db.collection("volunteerUsers").doc(this.IDlogged).update({
          status: 2
    }) .catch(error => console.log(error))

    else
      db.collection("ElderlyUsers").doc(idV).update({
        status: 2
      }) .catch(error => console.log(error))
    
   console.log("idE: ",idE)
   db.collection("ElderlyUsers").doc(idE).update({
      status: 2
    }) .catch(error => console.log(error))
    this.user.status = 2;
    this.userV[i].status = 2
  }


//Handle in case the volunteer confirms that the meeting has occurred
  acceptedMeeting(idE , idV, i)
  {
    const db = firebase.firestore();       
    if(idV == 0)
      db.collection("volunteerUsers").doc(this.IDlogged).update({
        status: 4,
        dateSendRemider: ""
      }) .catch(error => console.log(error))

    else
      db.collection("volunteerUsers").doc(idV).update({
        status: 4,
        dateSendRemider: ""
      }).catch(error => console.log(error))
    
      
    db.collection("ElderlyUsers").doc(idE).update({
      status: 4 
     }).catch(error => console.log(error))

      this.user.status = 4;   
      this.userV[i].status = 4   
   }



  //save the date that meeting has occurred 
  saveTheDate(index)
  {
    console.log(this.meetingDate)
    let tmp = this.userE[index].matching
    console.log(this.userE[index])
    const db = firebase.firestore();
    db.collection("ElderlyUsers").doc(this.userE[index].docID).update({
        matching: {id: tmp.id, grade: tmp.grade ,date: tmp.date, meetingDate: this.meetingDate}
      }) .catch(error => console.log(error))
  }


}
