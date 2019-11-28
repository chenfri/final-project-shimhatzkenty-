import {Component} from '@angular/core';
import {NavController ,NavParams} from 'ionic-angular';
import {Form} from '../form/form';
import {contactPage} from '../contactPage/contactPage'
import {RegisterPage} from '../register/register'
import {LoginPage} from '../login/login'
import {User} from '../../module/User'
import firebase from 'firebase';
import {AlertController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {Facebook} from '@ionic-native/facebook/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage 
{
  user = {} as User;

  constructor(public navCtrl: NavController, public params: NavParams,
    public alertCtrl: AlertController, public auth: AngularFireAuth,private facebook:Facebook)
  {
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    if(firebase.auth().currentUser != null)
    console.log(firebase.auth().currentUser.uid);

    if(this.user.loggedIn)
      this.get_data_from_firebase();
  }


  gmailLogin()
  {
    this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
      console.log(res)
      alert("success")
    })
  }

facebookLogin()
{
  console.log("gg")
  this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((res)=>{
    alert(res.user.uid)
  //  this.navCtrl.push(RegisterPage);

  })
}


facebooklogin()
{
  let provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider).then(()=>{ 
    console.log("a")
    firebase.auth().getRedirectResult().then((result)=>{
      console.log(result.user.uid) 
      console.log("b")
   
    }).catch(function(error)
    { console.log(JSON.stringify(error))})
  })
}




  get_data_from_firebase()
  {
    const db = firebase.firestore();

    db.collection('ElderlyUsers').doc(firebase.auth().currentUser.uid).get()
      .then(result =>{
        if (result.exists){
          this.user.elderly = true;
        }
        else
        {
          db.collection('volunteerUsers').doc(firebase.auth().currentUser.uid).get()
          .then(result =>{
            if (result.exists)
              this.user.volunteer = true;      
            else return;   })
        }
      }) 
  }


  elderly_form() {
    this.user.elderly = true;   
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn});
  }

  volunteer_form() {
    this.user.elderly = false;
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn});
  }

  contactPage() {
    this.navCtrl.push(contactPage);
  }

  registry(){
    this.navCtrl.push(RegisterPage);
  }

  login(){
    this.navCtrl.push(LoginPage);
  }
  
   logout() {
    firebase.auth().signOut();
    this.navCtrl.push(HomePage);
 }

}
