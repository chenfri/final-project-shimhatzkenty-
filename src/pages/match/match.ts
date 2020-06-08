import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { User } from '../../module/User';
import firebase from 'firebase';
import { AlertController} from 'ionic-angular';


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
  cancelText: boolean;
  cancelDescription: string;
  nameLogged: string;
  cancellationReason: boolean;
  rejArr :any[]

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) { 
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)
    console.log('this.IDlogged', this.IDlogged)

    // this.user.status = -1;
    // this.statusManagement();
    // console.log('this.statusManagement(): ', this.user.status)

    this.cancelDescription = null; 
    this.acceptedMatch = false;

    console.log('this.IDlogged', this.IDlogged)

    for(var i=0 ; i<this.userV.length;i++){
 
      if(this.IDlogged == this.userV[i].docID)     
        this.nameLogged = this.userV[i].name;;
    }

    console.log("name" , this.nameLogged )
    console.log('admin: ', this.user.Admin , 'loggedIn: ', this.user.loggedIn ,
                this.userE , this.userV  )
    console.log( 'userE[1].matching ' ,this.userE[1].matching.id , 'userE[1].matching.id' ,this.userE[1].matching.id)

    this.showMatch = false
    this.cancelText = false

    this.getVolunteerNumbers();
    console.log('numbers' , this.numbers)
    }



    statusManagement(){
      const db = firebase.firestore();       
   
      // if(!this.user.status){
        db.collection("volunteerUsers").doc(this.IDlogged).get().then(result => {
          if (!result.exists) return
          this.user.status  = result.data().status
        }).catch(error => {console.log(error)})
      // }
            console.log(this.IDlogged)
            console.log("status: " , this.user.status)
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

      if(push == false){
          console.log("ENTER")
          this.numbers.push(-1); }
    }
}
  


  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }


  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }



  CancelMatch(idE, idV ,i)
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
    }
      },
      {
        text: 'לא',
        handler: () => {
          console.log('no clicked');
        }
      }
    ]
  });
    alert.present();
  
    this.cancelText = true;
    this.userV[i].status = 3   
}
  

saveDescription(description, idE, idV ,i)
{
  console.log('saveDescription', this.cancelDescription)
  const db = firebase.firestore(); 

  if(this.user.Admin == false && this.user.loggedIn)
      idV = firebase.auth().currentUser.uid

  let alert = this.alertCtrl.create({
    title: 'בוצע',
    subTitle: 'סיבת הביטול נשמרה!',
    buttons: ['אישור']
  });
  
  alert.present();

  this.rejArr = this.userV[i].rejected

  if(this.rejArr != null)
    this.rejArr =[...this.rejArr,{id: idE, reason: this.cancelDescription}]
  else
    this.rejArr =[{id: idE, reason: this.cancelDescription}]
    console.log(this.rejArr)

  this.userV[i].rejected = this.rejArr = this.rejArr

  db.collection("volunteerUsers").doc(idV).update({
    rejected:this.rejArr,
  }).catch(error => {console.log(error)}) 


  this.cancelText = false;
  this.cancellationReason = true;
}


  acceptMatch(idE , idV, i)
  {
    const db = firebase.firestore();       
    this.acceptedMatch = true;  
    if(idV == 0)
        db.collection("volunteerUsers").doc(this.IDlogged).update({
          status: 2
    }) 
    else{
      db.collection("volunteerUsers").doc(idV).update({
        status: 2
      }) 
    }
   
   db.collection("ElderlyUsers").doc(idE).update({
      status: 2
    }) 
    this.user.status=2;
    this.userV[i].status = 2

    
  }






  acceptedMeeting(idE , idV, i)
  {
    const db = firebase.firestore();       
    if(idV == 0)
    db.collection("volunteerUsers").doc(this.IDlogged).update({
      status: 4
      }) 

    else{
      db.collection("volunteerUsers").doc(idV).update({
        status: 4
        }) 
    }
    db.collection("ElderlyUsers").doc(idE).update({
      status: 4 }) 

      this.user.status=4;   
      this.userV[i].status = 4   

      
   }

}
