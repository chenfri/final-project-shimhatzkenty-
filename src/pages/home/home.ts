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
// import {Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {Platform} from 'ionic-angular';
import { adminPage } from '../Admin/adminPage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage 
{
  user = {} as User;

  constructor(public navCtrl: NavController, public params: NavParams,
        public alertCtrl: AlertController, public auth: AngularFireAuth, private platform: Platform)
  {
    
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if login:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)

    if(this.user.loggedIn)
      this.checkIfElderly();

   /* if(firebase.auth().currentUser != null)
      console.log("uid: "firebase.auth().currentUser.uid);*/

  }


  gmail()
  {
    if(this.platform.is('capacitor'))
    {
      alert("capacitor platform")
    //  this.googleLogin();
    }
    else if(this.platform.is('android'))
    {
      alert("android platform")
     // this.nativeGoogleLogin();
    }
    else
    {
      alert("web platform")
      this.gmailLogin();
    }
  }


//    nativeGoogleLogin() {
//      alert("a")
//     this.gplus.login({})
//     .then(res => {alert(res)})
//     .catch(err => {alert(err)});
// }

  // googleLogin(): Promise<any> {
  //   alert("a")
  //   return new Promise((resolve, reject) => { 
  //     alert("b")
  //       this.gplus.login({
  //         'webClientId': '377941126479-70vb0jtmhuoksg2r0r3jhbi9975b4sla.apps.googleusercontent.com',  
  //         'offline': true
  //       }).then( res => {
  //               const googleCredential = firebase.auth.GoogleAuthProvider
  //                   .credential(res.idToken);
  //                   alert("c")
  //               firebase.auth().signInWithCredential(googleCredential)
  //             .then( response => {
  //               alert("d")
  //                 console.log("Firebase success: " + JSON.stringify(response));
  //                 resolve(response)
  //             });
  //       }, err => {
  //         alert("e")
  //           console.error("Error: ", err)
  //           reject(err);
  //       });
  //     });
  //     }


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




  checkIfElderly()
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

 get_data_for_admin()
 {
   let eldely = []
   let volunteer = []
   let messages = []
   let j =0 , k = 0 , l=0
   const db = firebase.firestore();
   const result = db.collection('ElderlyUsers').get().then(res =>
   {  res.forEach(i => {eldely[j]=(i.data()); j++}) })


   const result1 = db.collection('volunteerUsers').get().then(res =>
    {res.forEach(i =>{ volunteer[k]=(i.data());k++})})

    const result2 = db.collection('message').get().then(res =>
      {res.forEach(i =>{ messages[l]=(i.data());l++})})

    this.navCtrl.push(adminPage, {'eldely': eldely , 'volunteer': volunteer , 'messages': messages});
 } 

}
