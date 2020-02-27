import {Component, ViewChild} from '@angular/core';
import {NavController ,NavParams, Content } from 'ionic-angular';
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
import {Functions} from '../../providers/functions'
import {GalleryPage} from '../gallery/gallery'
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})

export class HomePage 
{
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  user = {} as User;
  useri: Observable<firebase.User>;
  devicePlatform: boolean
  organization: any;
  public organizations: any[]

  constructor(public navCtrl: NavController, public params: NavParams,  public alert: AlertProvider,
        public auth: AngularFireAuth, private platform: Platform, public func:Functions)
  {

    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    if(this.user.loggedIn == undefined)
      this.user.loggedIn = false;
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)
  }


scrollToBottom() {
    setTimeout(() => {
        this.content.scrollTo(1000,1000,1000);
    });
}


  ngAfterViewInit() {
   // this.slides.onlyExternal = true;   //to do not touch on the slides
    this.slides.autoplayDisableOnInteraction = false;
    this.slides.freeMode = true;
  }


  elderly_form()
  {
    this.user.elderly = true;   
    this.user.volunteer = false;
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn,
     'volunteer': this.user.volunteer,});
  }

  
  volunteer_form()
  {
    this.user.elderly = false;
    this.user.volunteer = true;
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(Form, {'elderly':this.user.elderly,'volunteer': this.user.volunteer,
     'login':this.user.loggedIn});
  }


  contactPage() {
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(contactPage)
  }
  

  gallery() {
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(GalleryPage);
  }

  
  login(){
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(LoginPage);
  }

  
  logout()
  {
    firebase.auth().signOut();
    this.user.loggedIn = false;
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn }); 
 }


  get_data_for_admin()
  {
    let elderly = [] , volunteer = [] , messages = [] , students=[] , organizationEledry=[]
    let k = 0 , l = 0 , j = 0 , t=0 , v=0
   
    const db = firebase.firestore();
    db.collection('ElderlyUsers').get().then(res => { res.forEach(i => { elderly[k] =
      [ i.data().fullName,
        i.data().phone,
        i.data().address,
        i.data().nameAssistant,
        i.data().contact,
        i.data().dateTime,
        i.id]
        k++})}).catch(error => {console.log(error)})


    db.collection('ElderlyUsers').get().then(res => { res.forEach(i => {
      if(i.data().behalf == true )
      {
      
        // find name of organization
        this.organizations = i.data().organization;
        for (let i = 0; i < this.organizations.length; i++)
        {
            if(this.organizations[i].currentValue){
              this.organization = this.organizations[i].species;
              console.log("organization.func :  " + this.organization)
              break;}
        }
  
          console.log("org ",this.organization)
          if(this.organization != null)
          {
              organizationEledry[v] = 
              [
                i.data().fullName,
                i.data().phone,
                i.data().nameAssistant,
                i.data().contact,
                this.organization,
                i.id,
              ]
              v++;
          }
      }
      })}).catch(error => {console.log(error)})
   

    db.collection('volunteerUsers').get().then(res => {res.forEach(i =>{ 
      volunteer[j] =
      [ i.data().fullName,
        i.data().phone,
        i.data().address,
        i.data().dateTime,
        i.id
      ]
        j++})}).catch(error => {console.log(error)})


    db.collection('volunteerUsers').get().then(res => {res.forEach(i =>{
      if(i.data().student == true)
      {
        students[t] =
        [ i.data().fullName,
          i.data().phone,
          i.data().id,
          i.data().college,
          i.data().dateTime,
          i.id
        ]
        t++;
      } 
    })})  .catch(error => {console.log(error)})


    db.collection('message').get().then(res => {res.forEach(i =>{ messages[l]={
        data: i.data() ,
        id : i.id }
        l++})}).catch(error => {console.log(error)})
      

    setTimeout(() =>
    {
      this.navCtrl.push(adminPage, {'elderly': elderly, 'volunteer': volunteer,
      'messages': messages ,'students': students, 'login': this.user.loggedIn, 'admin': this.user.Admin,
      'organizationEledry': organizationEledry,
      'elderNum': k , 'volunteerNum': j, 'studentNum': t, 'organizationNum': v});
        }, 1000);
  } 



  hamburger_Navbar() {
    var x = document.getElementById("topNav");
    if (x.className === "topnav") 
      x.className += " responsive";
    else 
      x.className = "topnav";
    
  }

  goToSlide() {
    this.slides.slideTo(2, 500);
  }
  
  //------------------------ function not in used ----------------------------------------
 
 // remember the last user who logged in and save it on login - only on android
 autoLogin()
 {
   let uid
   const db = firebase.firestore();
   var adminLogin = false
   if(!this.user.Admin)
   {
       firebase.auth().onAuthStateChanged(function(user)
       {
         if (user) {
           uid = firebase.auth().currentUser.uid
           console.log("uid: "+uid)
         }
       else 
           console.log("not logged in")
     });
     

     setTimeout(() =>
     {
       if(uid != undefined)
       {
          db.collection('Admin').doc(uid).get() //check if the  last user was logged in is admin
          .then(result =>{if(result.exists) {
           adminLogin = true
            this.user.loggedIn = false
            console.log("admin ", this.user.Admin)
          }}).catch(error => console.log(error))
            
       setTimeout(() =>
       {
         if(!adminLogin)
         {
           //get elderly document for know email and password
           db.collection('ElderlyUsers').doc(uid).get()
           .then(result =>{
           if (result.exists)
           {
             console.log("doc1 exist")
             this.user.loggedIn = result.data().loggedIn;  
             this.user.email =  result.data().email
             this.user.password = result.data().password
             this.user.elderly = true
             this.user.loggedIn = true
           }
           else //get volunteer document for know email and password
           {
             db.collection('volunteerUsers').doc(uid).get()
             .then(result =>{
               if (result.exists)
               {
                 console.log("doc2 exist")
                 this.user.loggedIn = result.data().loggedIn;  
                 this.user.email =  result.data().email
                 this.user.password = result.data().password
                 this.user.volunteer = true
                 this.user.loggedIn = true
                 console.log("email ", this.user.email)
               }
               firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(() =>console.log("success vol login"))
            
             }).catch(error => console.log(error))
           }
             
             firebase.auth().signInWithEmailAndPassword(this.user.email ,this.user.password).then(() =>console.log("success elder login"))

       }).catch(error => console.log(error))
     } },1500)
    }
 
   }, 2500);
   }
 }


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


CheckWhichOrganization(id)
{
  const db = firebase.firestore();
  db.collection('ElderlyUsers').doc(id).get()
  .then(result => {
    if (!result.exists) return
    this.organizations = result.data().organization;
      
    for (let i = 0; i < this.organizations.length; i++) {
        if(this.organizations[i].currentValue){
          this.organization = this.organizations[i].species;
          console.log("organization.func :  " + this.organization)
          break;

        }
    }    
    console.log("organizations ",this.organizations)
  
    })
}

}
