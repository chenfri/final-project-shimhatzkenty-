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
import {Observable} from 'rxjs/Observable'
import {Functions} from '../../providers/functions'
import { Slides } from 'ionic-angular';
import { Arrays } from '../../providers/arrays'
import { MatchPage} from '../match/match';
import { RegisterPage } from '../register/register';

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
  IDlogged : any;

  constructor(public navCtrl: NavController, public params: NavParams,  public alert: AlertProvider,
        public auth: AngularFireAuth, public func:Functions, public array:Arrays)
  {

    console.log("if login:")
    this.user.loggedIn = this.params.get('login');
    if(this.user.loggedIn == undefined)
      this.user.loggedIn = false;
    console.log(this.user.loggedIn)

    console.log("if admin:")
    this.user.Admin = this.params.get('admin');
    console.log(this.user.Admin)

    this.IDlogged = this.params.get('IDlogged')
    console.log("IDlogged ", this.IDlogged)


    var myArray = [{
      name: "Joe Blow",
      date: "2020-05-20"
    }, {
      name: "Sam Snead",
      date: "2020-05-19"
    }, {
      name: "John Smith",
      date: "2020-05-18"
    }];
    
    // myArray.sort(function compare(a, b) {
    //   var dateA = new Date(a.date);
    //   var dateB = new Date(b.date);
    //   return dateA.getTime() - dateB.getTime();
    // });
    
    // console.log(myArray);
  }


  
  add_AdminUser()
  {
    this.navCtrl.push(RegisterPage,{'login': this.user.loggedIn , 'admin': this.user.Admin}); 
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
    this.slides.autoplay = 1000;
  }


  elderly_form()
  {
    this.user.elderly = true;   
    this.user.volunteer = false;
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.setRoot(Form, {'elderly':this.user.elderly, 'login':this.user.loggedIn,
     'volunteer': this.user.volunteer,'IDlogged':this.IDlogged});
  }

  
  volunteer_form()
  {
    this.user.elderly = false;
    this.user.volunteer = true;

    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.setRoot(Form, {'elderly':this.user.elderly,'volunteer': this.user.volunteer,
     'login':this.user.loggedIn ,'IDlogged':this.IDlogged});
  }


  contactPage() {
    var x = document.getElementById("topNav");
    x.className = "topnav";
    this.navCtrl.push(contactPage, {'login': this.user.loggedIn })
  }
  // matchPage() {
  //   this.navCtrl.push(MatchPage , {'admin': this.user.Admin, 'login': this.user.loggedIn })
  // }
  

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


    groupByFuntion(arr, key) {

      return arr.reduce(function(rv, x) {

        (rv[x[key]] = rv[x[key]] || []).push(x);

        return rv;

      }, {});

    };


    findOrgNameByID(id)
    {
      let arr = this.array.organization
      for(let i = 0 ; i < arr.length; i++)
        if(arr[i].id == id)
          return arr[i].species
    }


  get_data_for_admin(whichPage)
  {
    let elderly = [] , volunteer = [] , messages = [] , students=[] , organizationEledry=[]
    let k = 0 , l = 0 , j = 0 , t=0 , v=0 , groupbyOrg = [] , tmpPhone = null
   
    const db = firebase.firestore();
    db.collection('ElderlyUsers').get().then(res => { res.forEach(i => { 
      tmpPhone = null
      if(i.data().contact != null)
        tmpPhone = "0" +i.data().contact
      elderly[k] =
       {name: i.data().fullName,
        phone: i.data().phone,
        address: i.data().address,
        nameAssistant: i.data().nameAssistant,
        contact: tmpPhone,
        dateTime: i.data().dateTime,
        date: i.data().date,
        docID: i.id,
        index: k,
        manualM: false,
        gender: i.data().gender,
        dayOfMeeting: i.data().dayOfMeeting,
        hobbies: i.data().hobbies,
        hours: i.data().hours,
        language: i.data().language,
        musicStyle: i.data().musicStyle,
        meetingWith: i.data().meetingWith,
        matching: i.data().matching,
        email: i.data().email,
        description: i.data().description}
        k++})}).catch(error => {console.log(error)})

    

    db.collection('ElderlyUsers').get().then(res => { res.forEach(i => {
      if(i.data().behalf == true )
      {
            if(i.data().orgi != null)
            {
              let orgName = this.findOrgNameByID(i.data().orgi)
              organizationEledry[v] = 
                { name: i.data().fullName,
                  phoneE: i.data().phone,
                  assistName: i.data().nameAssistant,
                  phoneA: i.data().contact,
                  id: orgName,              
                }        
              v++;
          }
      }
      })}).catch(error => {console.log(error)})
   


    db.collection('volunteerUsers').get().then(res => {res.forEach(i =>{ 
      volunteer[j] =
      {
        name: i.data().fullName,
        phone: i.data().phone,
        address: i.data().address,
        dateTime: i.data().dateTime,
        date: i.data().date,
        docID: i.id,
        index: j,
        manualM: false,
        gender: i.data().gender,
        dayOfMeeting: i.data().dayOfMeeting,
        hobbies: i.data().hobbies,
        hours: i.data().hours,
        language: i.data().language,
        musicStyle: i.data().musicStyle,
        meetingWith: i.data().meetingWith,
        email: i.data().email,
        status: i.data().status,
        rejected: i.data().rejected
      }
        j++})}).catch(error => {console.log(error)})

      
    db.collection('volunteerUsers').get().then(res => {res.forEach(i =>
  {
      var ID = new String(i.data().id)
      if(String(i.data().id).length < 9)
      {
        var ID = new String(i.data().id)
        while (ID.length < 9) 
          ID = "0" + ID;
      }
       
      if(i.data().student == true)
      {
        students[t] =
        {
          name: i.data().fullName,
          phone: i.data().phone,
          id: ID,
          college: i.data().college,
          date: i.data().dateTime,
          codID: i.id
        }
        t++;
      } 
    })})  .catch(error => {console.log(error)})


    db.collection('message').get().then(res => {res.forEach(i =>{ messages[l]={
        data: i.data() ,
        id : i.id }
        l++})}).catch(error => {console.log(error)})
      

    setTimeout(() =>
    {
      groupbyOrg = this.groupByFuntion(organizationEledry,"id")
      if(whichPage == 1){
          this.navCtrl.push(adminPage, {'elderly': elderly, 'volunteer': volunteer,
          'messages': messages ,'students': students, 'login': this.user.loggedIn, 'admin': this.user.Admin,
          'organizationEledry': groupbyOrg});
      }
      else if(whichPage == 2){
        this.navCtrl.push(MatchPage, {'elderly': elderly, 'volunteer': volunteer,
           'login': this.user.loggedIn, 'admin': this.user.Admin , 'IDlogged': this.IDlogged});
      }
     
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


  hamburgerNavbar() {
    
    var x = document.getElementById("topNav");
    if (x.className === "topnav") {
      x.className += " responsive";
      console.log("x1 = " , x)
    }
    else {
      x.className = "topnav";
      console.log("x2 = " , x)
  
    }
  }
}