import {Component} from '@angular/core';
import {NavController ,NavParams} from 'ionic-angular';
import {adminPage} from '../Admin/adminPage';
import {Form} from '../form/form';
import {contactPage} from '../contactPage/contactPage'
import {LoginPage} from '../login/login'
import {User} from '../../module/User'
import {AlertProvider} from '../../providers/alert/alert'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {Platform} from 'ionic-angular';
import {Observable} from 'rxjs/Observable'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage 
{

  user = {} as User;
  useri: Observable<firebase.User>;
  platformA: boolean

  constructor(public navCtrl: NavController, public params: NavParams,  public alert: AlertProvider,
        public auth: AngularFireAuth, private platform: Platform//, private gplus: GooglePlus
        )
  {
    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)

    console.log("if elderly:")
    this.user.elderly = this.params.get('elderly');
    console.log(this.user.elderly)

    console.log("if volunteer:")
    this.user.volunteer = this.params.get('volunteer');
    console.log(this.user.volunteer)

    if(this.user.loggedIn && this.user.Admin == false)
      this.checkIfElderly();

  }


  ionViewDidEnter()
  {
    if(this.platform.is('android'))
    {
      this.platformA = true;
      console.log("android platform")
    
    }
    else
    {
      this.platformA = false;
      console.log("web platform")
    }
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
            else 
            {
              this.user.Admin = true;  
              const db = firebase.firestore();
              db.collection('Admin').doc(firebase.auth().currentUser.uid).set({})
           }
           }).catch(error => {console.log(error)})
        }
      }).catch(error => {console.log(error)})
  }


  elderly_form() {
    this.user.elderly = true;   
    this.user.volunteer = false;
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn,
     'volunteer': this.user.volunteer,});
  }

  volunteer_form() {
    this.user.elderly = false;
    this.user.volunteer = true;
    this.navCtrl.push(Form, {'elderly':this.user.elderly,'volunteer': this.user.volunteer,
     'login':this.user.loggedIn});
  }

  contactPage() {
    this.navCtrl.push(contactPage, {'login':this.user.loggedIn});
  }

  login(){
    this.navCtrl.push(LoginPage, {'login':this.user.loggedIn});
  }
  
   logout() {
    firebase.auth().signOut();
    this.navCtrl.push(HomePage);
 }

 
 get_data_for_admin()
 {
   let elderly = [] , volunteer = [] , messages = []
   var k = 0 , l = 0 , j = 0 
   
   const db = firebase.firestore();
   db.collection('ElderlyUsers').get().then(res => { res.forEach(i => { elderly[k] =
     [ i.data().fullName,
       i.data().phone,
       i.data().address,
       i.id]
       k++})}).catch(error => {console.log(error)})

   db.collection('volunteerUsers').get().then(res => {res.forEach(i =>{ volunteer[j] =
     [ i.data().fullName,
       i.data().phone,
       i.data().address,
       i.id]
       j++})}).catch(error => {console.log(error)})

    db.collection('message').get().then(res => {res.forEach(i =>{ messages[l]={
        data: i.data() ,
        id : i.id }
        l++})}).catch(error => {console.log(error)})
      

    setTimeout(() =>
    {
      this.navCtrl.push(adminPage, {'elderly': elderly, 'volunteer': volunteer,
      'messages': messages , 'login': this.user.loggedIn, 'admin': this.user.Admin,
       'elderNum': k , 'volunteerNum': j });
        }, 1000);
  } 


 //----------------------------------------------------------------
 
 gmail()
 {
   if(this.platform.is('android'))
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


//  async nativeGoogleLogin() : Promise <void>
//  {
//   this.gplus.login({})
//   .then(res => alert(res))
//   .catch(err => alert(err));

//   /*  alert("a")
//     this.gplus.login({
//       'webClientId' : '377941126479-263ts6tp63gv2vkp8946q5ui8ce6u6u3.apps.googleusercontent.com',
//       'offline': true
//     }).then(res => {
//       alert("b")
//       this.auth.auth.signInWithCredential(
//         firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(suc => {
//           alert("success login")
//         }).catch(error => {alert("not success")})
//     })*/
//  }
 

 gmailLogin()
 {
   this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
     console.log(res)
     alert("login success")
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


imageObject: Array<object> = [{
  image: 'https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/gallery1.jpg?alt=media&token=bee8fa7e-be21-490b-8692-97c425cbcfb8',
  ///thumbImage: 'assets/img/slider/1_min.jpeg',
  //alt: 'alt of image',
  title: 'title of image'
}, {
  image: 'https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/gallery1.jpg?alt=media&token=bee8fa7e-be21-490b-8692-97c425cbcfb8', // Support base64 image
  //thumbImage: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
  title: 'Image title', //Optional: You can use this key if want to show image with title
  //alt: 'Image alt' //Optional: You can use this key if want to show image with alt
}
];
}
