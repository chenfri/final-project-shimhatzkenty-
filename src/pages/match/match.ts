import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams, AlertController} from 'ionic-angular';
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
  cancelText: boolean;
  cancelDescription: string;
  nameLogged: string;
  rejArr :any[]

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public alertCtrl: AlertController) { 
   
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');
    this.IDlogged = this.navParams.get('IDlogged');
    console.log(this.userE)
    console.log(this.userV)
    console.log('this.IDlogged', this.IDlogged)

    if(!this.user.Admin)
      this.statusManagement();

    this.cancelDescription = ""; 

    for(var i = 0 ; i < this.userV.length; i++){
       if(this.IDlogged == this.userV[i][4]) 
        this.nameLogged = this.userV[i][0];}

    console.log("name" , this.nameLogged )
    console.log('admin: ', this.user.Admin , 'loggedIn: ', this.user.loggedIn ,
                this.userE , this.userV  )
    console.log( 'userE[1][16] ' ,this.userE[1][16][0] , 'userE[1][16][0]' ,this.userE[1][16][0])

    this.showMatch = false
    this.cancelText = false

    this.getVolunteerNumbers();

    console.log('numbers' , this.numbers)
    this.user.status = -1;
    }



  statusManagement()
  {
    const db = firebase.firestore();       

    if(!this.user.status)
      db.collection("volunteerUsers").doc(this.IDlogged).get().then(result => {
        if (!result.exists) return
        this.user.status = result.data().status
      })
  }

  

getVolunteerNumbers()
{
  //this.numbers = [0]
  for(var i = 0; i < this.userE.length; i++){
    
    if(this.userE[i][16])
    {
      var volID = this.userE[i][16][0];
      var push = false;

      for(var j = 0 ; j < this.userV.length; j++)
      {
        var index = this.userV[j][4].localeCompare(volID)
        if(this.userV[j][4].localeCompare(volID) == 0 ){
            this.numbers.push(this.userV[j][5]); 
            push = true;}
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
      if(this.user.Admin == false && this.user.loggedIn)
        idV = firebase.auth().currentUser.uid
    
      this.rejArr = this.userV[i][16]
      console.log(this.rejArr)
      if(this.rejArr != null)
        this.rejArr =[...this.rejArr, idE]
      else
        this.rejArr =[idE]
        console.log(this.rejArr)
      this.userV[i][16] = this.rejArr
      const db = firebase.firestore();    
      db.collection("ElderlyUsers").doc(idE).update({
          matching: ["",0],
          status: 0
      }).catch(error => {console.log(error)}) 
    
      db.collection("volunteerUsers").doc(idV).update({
        matching: null,
        rejected:this.rejArr,
        status: 3
      }).catch(error => {console.log(error)}) 
    
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
}



acceptMatch(idE , idV)
{
  const db = firebase.firestore();       
  this.acceptedMatch = true;  
  if(idV == 0)
      db.collection("volunteerUsers").doc(this.IDlogged).update({
        status: 2
    }) 
  
  else
  db.collection("volunteerUsers").doc(idV).update({
    status: 2
}) 
  
  db.collection("ElderlyUsers").doc(idE).update({
    status: 2}) 
}


acceptedMeeting(idE , idV)
{
  const db = firebase.firestore();       
  if(idV == 0)
  db.collection("volunteerUsers").doc(this.IDlogged).update({
    status: 4
    }) 

  else
    db.collection("volunteerUsers").doc(idV).update({
      status: 4
      }) 
  
  db.collection("ElderlyUsers").doc(idE).update({
    status: 4 }) 
}

}
