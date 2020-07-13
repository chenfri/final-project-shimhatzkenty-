import { NavController,NavParams, AlertController, PopoverController ,Events} from 'ionic-angular';
import { Component } from '@angular/core';
import firebase from 'firebase';
import * as papa from 'papaparse';
import {AlertProvider} from '../../providers/alert/alert'
import { User } from '../../module/User'
import { Contact } from '../../module/Contact'
import { HomePage } from '../home/home';
import { PopoverPage } from '../popover/popover';
import { ModalController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
{
  contact = {} as Contact
  user = {} as User
  organizationName: any;
  userE : any[]
  userV : any[]
  organizationEledry : any[]
  messages : any[]
  csvData: any[] = []
  headerRow: any[] = []
  public organizations: any[]
  public matchE: any;
  public matchV: any;
  public date: any;
  public adminComments: any;
  public studentArr :any[] = [];
  public contacts: any[]
  public parameters: any[]
  public dates:any[] = [];
  public volunteerMatches: any[] = []
  public elderMatches: any[] = []
  public androidPlat = false

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController ,
     public alert: AlertProvider, private event: Events, public popoverCtrl: PopoverController,
     public modalController: ModalController, public platform: Platform) 
  {
    //inialize variables
    this.matchE = null;
    this.matchV = null;
    this.date = new Date().toISOString().substring(0, 10);
  }


  ngOnInit()
  {

    if (this.platform.is('android'))
      this.androidPlat = true;

    //get parameters form other pages
    this.user.loggedIn = this.navParams.get('login');
    this.user.Admin = this.navParams.get('admin');
    this.organizationEledry = this.navParams.get('organizationEledry');
    this.messages = this.navParams.get('messages');
    this.contacts = this.navParams.get('contacts'); 
    this.userE = this.navParams.get('elderly');
    this.userV = this.navParams.get('volunteer');

    //update array of users that would be sorted by dates
    this.sortArrByDates(this.userV)
    console.log('this.userV: ', this.userV);
    this.sortArrByDates(this.userE)
    console.log('this.userE: ', this.userE);

    this.getVolunteerMatches();
    console.log('this.volunteerMatches', this.volunteerMatches)
    this.getElderlyMatches();
    console.log('this.elderMatches', this.elderMatches)

    this.reverseDates(); 

    let j = 0; //arrange array of students
    for(let i = 0 ; i < this.userV.length; i++)
    {
      if(this.userV[i].student){
        this.studentArr[j] = this.userV[i]
        j++}
    }
  //    console.log('this.studentArr', this.studentArr)

  }


  //the method return array that every index represent volunteer
  // in cell we write the index of matcing elderly
  getVolunteerMatches()
  {
    for(var i = 0; i < this.userV.length; i++)
    {

      if(this.userV[i].status != 0 && this.userV[i].status != -1) 
      {
        var eID = this.userV[i].matching;
        var push = false;

        for(var j = 0 ; j < this.userE.length; j++)
        {         
            if(this.userE[j].docID.localeCompare(eID) == 0 ){
            this.volunteerMatches.push(j); 
              push = true; }
        } 
      }

      else
          this.volunteerMatches.push(-1); }
}





  //the method return array that every index represent elderly
  // in cell we write the index of matcing volunteer
  getElderlyMatches()
  {
    for(var i = 0; i < this.userE.length; i++)
    {
      if(this.userE[i].status != 0 && this.userE[i].status != -1) 
      {
        var volID = this.userE[i].matching.id;
        var push = false;

        for(var j = 0 ; j < this.userV.length; j++)
        {      
            if(this.userV[j].docID.localeCompare(volID) == 0 ){
            this.elderMatches.push(j); 
              push = true; }
        } 
      }

      else
          this.elderMatches.push(-1); }
  }



// reverse the dates in tables
  reverseDates()
  {
    for(let i = 0 ; i < this.userE.length; i++)
    {
      if(this.userE[i].status != 0)
      {
      let date = this.userE[i].matching.date
      let tmp = date.split("-").reverse().join("-");
      this.dates.push(tmp)
      }
      else
        this.dates.push("")
    }
    //console.log(this.dates)
  }


  async presentModal() {
    const modal = await this.modalController.create(ModalPage, {whichPage: 'Admin'}, {enableBackdropDismiss:false});
    await modal.present();
    await modal.onDidDismiss(data => {
      if(data != "closed")
      {
        this.parameters = data
        this.matchingAlgorithm()
      }
    })
  }


  async presentModalMatch() {
    const modal = await this.modalController.create(ModalPage, {whichPage: 'matchAccept', userV: this.userV, userE: this.userE}
    , {enableBackdropDismiss:false});
    await modal.present();
    // await modal.onDidDismiss(data => {
    //   if(data != "closed")
    //   {
    //     this.parameters = data
    //     this.matchingAlgorithm()
    //   }
    // })
  }


  saveConnemnts()
  {
    this.save_AdminComments(this.userV, "volunteerUsers")
    this.save_AdminComments(this.userE, "ElderlyUsers")
  }



  save_AdminComments(arr, collection)
  {
    const db = firebase.firestore();
    for(let i = 0; i < arr.length; i++)
    {
      if(arr[i].commentTmp != arr[i].adminComments) // save only if the comment was change
      {
      console.log(i)
      console.log(arr[i].adminComments)

          db.collection(collection).doc(arr[i].docID).update({
          adminComments: arr[i].adminComments
          }) .catch((error) => {console.log(error)})
        }
    }
  }



  sortArrByDates(arr)
  {
    arr.sort(function(a,b){
      var da = new Date(a.date).getTime();
      var db = new Date(b.date).getTime();
      
      return da < db ? 1 : da > db ? -1 : 0
    });
  }



  //create excel file with the rellevant data
  csvFile(array , type)
  {
    let tmp= [] ; let j = 0 

    if(array != null || array != undefined)
    {
      for(let i = 0 ; i < array.length ; i++)
      {
        var meetingWith = ""
        if(array[i].meetingWith == 1)
          meetingWith = "אין העדפה"
        else if(array[i].meetingWith == 2)
          meetingWith = "נשים בלבד"
        else
          meetingWith = "גברים בלבד"

          
        let gender = ""
        if(array[i].gender == 1)
          gender = "נקבה"
        else if(array[i].gender == 2)
          gender = "זכר"
        else
          gender = "לא רלוונטי"


        if(type == "organization")
        {
          this.headerRow = ["שם", "פלאפון הקשיש" ,"שם איש קשר","פלאפון איש קשר" , "שם האירגון"]
          tmp[i] = [array[i].name, array[i].phoneE, array[i].assistName, array[i].phoneA, array[i].id]  
        }

        if(type == "eledry")
        {
          this.headerRow = ["שם", "פלאפון" , "כתובת", "שם איש קשר", "פלאפון איש קשר", "תאריך הרשמה"]
          tmp[i] = [array[i].name, array[i].phone, array[i].address, array[i].nameAssistant,
          array[i].contact, array[i].dateTime]  


          this.headerRow = ["שם", "פלאפון", "כתובת", 
          "תאריך הרשמה", "שם איש קשר" ,"פלאפון איש קשר","אימייל","תיאור","מגדר","תחומי עיניין" 
          ,"ימים מועדפים", "שעות מועדפות", "מעוניין להיפגש עם", "שפות"]
          tmp[i] = [array[i].name, array[i].phone, array[i].address, array[i].dateTime,
           array[i].nameAssistant,array[i].contact, array[i].email, array[i].description, gender,
            this.checkedFunction(array[i].hobbies), this.checkedFunction(array[i].dayOfMeeting),
            this.checkedFunction(array[i].hours), meetingWith, this.checkedFunction(array[i].language)]
        }

        if(type == "volunteer")
        {
          let student = ""
          if(array[i].student)
            student = "כן"
          else
            student = "לא"


          let college = ""
          if(array[i].college != null)
            college = array[i].college

          this.headerRow = ["שם", "פלאפון", "כתובת", 
          "תאריך הרשמה", "תעודת זהות" ,"אימייל","גיל","סטודנט" ,"מוסד אקדמי","מגדר","תחומי עיניין" 
          ,"ימים מועדפים", "שעות מועדפות", "מעוניין להיפגש עם", "שפות"]
          tmp[i] = [array[i].name, array[i].phone, array[i].address, array[i].dateTime,
           array[i].id, array[i].email, array[i].age,student, college, gender,
            this.checkedFunction(array[i].hobbies), this.checkedFunction(array[i].dayOfMeeting),
            this.checkedFunction(array[i].hours), meetingWith, this.checkedFunction(array[i].language)]  
        }

        if(type == "student") {
          this.headerRow = ["שם" , "פלאפון", "תעודת זהות","מוסד אקדמי"]
          if(array[i].student){
            tmp[j] = [array[i].name, array[i].phone, array[i].id, array[i].college]
            j++}
        }
     
      }
    }

    let csv = papa.unparse({
      fields: this.headerRow,
      data: tmp
    });

    this.downloadCSV(csv , type)
  }


  checkedFunction(arr)
  {
    let str = ""
    for(let i = 0 ; i < arr.length; i++)
    {
      if(arr[i].currentValue && i != 0)
        str += ", " + arr[i].species
      else if(arr[i].currentValue)
        str += arr[i].species

    }
    return str;
  }

  //download excel file
  downloadCSV(csv, type)
  { 
    var blob = new Blob(["\ufeff", csv]);
    var a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(blob);
    if(type == "eledry")
      a.download = "דוח קשישים.csv";
    if(type == "student") 
      a.download = "דוח סטודנטים.csv";
    if(type == "organization")
      a.download = "דוח ארגונים.csv";
    if(type == "volunteer")
      a.download = "דוח מתנדבים.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 


  // modal for get 'more details' about the users
  async openPopover(event , uid, userType)
  {
    console.log("openPopover")
    let popover = this.popoverCtrl.create(PopoverPage , {'uid': uid ,'userType': userType });
    popover.present({
      ev: event
    });
  }


  deleteMessage(item)
  {
      let alert = this.alertCtrl.create({
        title: 'אזהרה',
        subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את ההודעה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
              const db = firebase.firestore();
                    
              db.collection('message').doc(item).delete().then(() =>
              {
                this.event.publish('operateFunc', "1")
                console.log("Document successfully deleted!");
                //this.alert.showAlert_deleteMessage()
            }).catch((error) => console.error("Error removing document: ", error));         
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



  click_home()
  {
    this.navCtrl.setRoot(HomePage, {'login': this.user.loggedIn , 'admin': this.user.Admin}); 
  }



  deleteElderlyUser(item , index)
  {
   
    let alert = this.alertCtrl.create({
    title: 'אזהרה',
    subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את המשתמש?' ,
    buttons: [
    {
      text: 'כן',
      role: 'cancel',
      handler: () => {
          console.log('yes clicked');
          const db = firebase.firestore();
        if(item != "")
          db.collection("ElderlyUsers").doc(item).delete().then(() =>
          {

            if(this.userE[index].status != 0 && this.userE[index].status != -1) 
            {
              let volId= this.userE[index].matching.id
              let volIndex = this.elderMatches[index]
              let arrDates = this.userV[volIndex].arrDates
              let arrTmp = []

              if(arrDates)
              {
                for(let i = 0 ; i < arrDates.length; i++)
                  if(arrDates[i].idElder != item)
                    arrTmp.push(arrDates[i])
              }
              
              db.collection("volunteerUsers").doc(volId).update({
                matching:"",
                status: 0,
                dateSendRemider: "",
                arrDates: arrTmp
              }).catch(error => {console.log(error)}) 
            }
            this.event.publish('operateFunc', "1")    
            console.log("Document successfully deleted!")
          }).catch((error) => console.error("Error removing document: ", error)); 
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


  addNewContact(){
    let temp = {name: "", phone: "", jobTitle: "", email: "", comments: "", date: "", orgName: "", docID: ""}
    let tempArr = []
    for(let i = 0 ; i < this.contacts.length; i++)
      tempArr.push(this.contacts[i])
    tempArr.push(temp)
    console.log(tempArr)
    this.contacts = tempArr
  }



  saveNewContact()
  {
    const db = firebase.firestore();
    for(let i = 0 ; i < this.contacts.length; i++)
    {
      if(this.contacts[i].docID != "") //update exist doc
      {
        db.collection("Contacts").doc(this.contacts[i].docID).update({
          name: this.contacts[i].name,
          phone: this.contacts[i].phone,
          email: this.contacts[i].email,
          orgName: this.contacts[i].orgName,
          jobTitle: this.contacts[i].jobTitle,
          comments: this.contacts[i].comments,
          date: this.contacts[i].date
    
        }).catch((error) => console.error("Error add contact: ", error));
        }
      
      else //create exist doc
      {
        var doc = db.collection("Contacts").doc()
        doc.set({
        name: this.contacts[i].name,
        phone: this.contacts[i].phone,
        email: this.contacts[i].email,
        orgName: this.contacts[i].orgName,
        jobTitle: this.contacts[i].jobTitle,
        comments: this.contacts[i].comments,
        date: this.contacts[i].date

      }).then(() => this.contacts[i].docID = doc.id)
         .catch((error) => console.error("Error add contact: ", error));

      }
  }
      
      
  }



  deleteContact(item)
  {
    console.log(item)
    let alert = this.alertCtrl.create({
      title: 'אזהרה',
      subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את האיש קשר?' ,
      buttons: [
      {
        text: 'כן',
        role: 'cancel',
        handler: () => {
          console.log('yes clicked');
          const db = firebase.firestore();
                
          db.collection("Contacts").doc(item).delete().then(() =>
          {
            this.event.publish('operateFunc', "1")    
            console.log("Document successfully deleted!");
  
          }).catch((error) => console.error("Error removing document: ", error));
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





  deleteVolunteerUser(item, index)
  {  
    let alert = this.alertCtrl.create({
    title: 'אזהרה',
    subTitle: 'האם את/ה בטוח/ה שברצונך למחוק את המשתמש?' ,
    buttons: [
    {
      text: 'כן',
      role: 'cancel',
      handler: () => {
        console.log('yes clicked');
        const db = firebase.firestore();
              
        db.collection("volunteerUsers").doc(item).delete().then(() =>
        {
       
             //let elderIndex;
             if(this.userV[index].status != 0 && this.userV[index].status != -1) 
             {
               let elderId= this.userV[index].matching
   
               db.collection("ElderlyUsers").doc(elderId).update({
                 matching:{id: "", grade: 0, date: ""},
                 status: 0
               }).catch(error => {console.log(error)}) 
             }
            
          this.event.publish('operateFunc', "1")    
          console.log("Document successfully deleted!");

        }).catch((error) => console.error("Error removing document: ", error));
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




  //the method gets 2 date and return the deffrence between them
  DiffrenceDates(d1, d2)
  {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }


  // --------------------------------- Matching ----------------------------------------

  //the function check if there is allready exist match for this volunteer
  checkIfExistMacthVolunteer(numVolunteer)
  {
    if(this.userV[numVolunteer].status != 0 && this.userV[numVolunteer].status != -1) 
    {
      let alert = this.alertCtrl.create({
        title: 'למתנדב שבחרת כבר קיימת התאמה',
        subTitle: 'האם את/ה רוצה להגדיר לו התאמה חדשה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
            console.log('yes clicked');
            this.userV[numVolunteer].manualM = true;

            let elderId= this.userV[numVolunteer].matching
            const db = firebase.firestore();
            db.collection("ElderlyUsers").doc(elderId).update({
              matching:{id: "", grade: 0, date: ""},
              status: 0
            }).catch(error => {console.log(error)}) 
      
          }
          },
          {
            text: 'לא',
            handler: () => {
              this.userV[numVolunteer].manualM = false
              console.log('no clicked');
            }
          }
        ]
      });
        alert.present();
    }
    this.matchV = this.userV[numVolunteer].docID
    this.userV[numVolunteer].manualM = true;

    for(var i = 0 ; i <this.userV.length; i++)
        if(numVolunteer != i)
          this.userV[i].manualM = false;
  }



  checkIfExistMacthElderly(numElderly)
  {
    if(this.userE[numElderly].status != 0 && this.userE[numElderly].status != -1) 
    {
      let alert = this.alertCtrl.create({
        title: 'לאזרח הותיק שבחרת כבר קיימת התאמה',
        subTitle: 'האם את/ה רוצה להגדיר לו התאמה חדשה?' ,
        buttons: [
        {
          text: 'כן',
          role: 'cancel',
          handler: () => {
            console.log('yes clicked');
            this.userE[numElderly].manualM = true;

            let volId= this.userE[numElderly].matching.id
            const db = firebase.firestore();
            db.collection("volunteerUsers").doc(volId).update({
              matching:"",
              status: 0,
              dateSendRemider: ""
            }).catch(error => {console.log(error)}) 
          }
          },
          {
            text: 'לא',
            handler: () => {
              console.log('no clicked');
              this.userE[numElderly].manualM = false
            }
          }
        ]
      });
        alert.present();
    }
    this.matchE = this.userE[numElderly].docID;
    this.userE[numElderly].manualM = true;

    for(var i = 0 ; i < this.userE.length; i++)
        if(numElderly != i)
          this.userE[i].manualM = false;

  }


//send reminder to volunteers to reports on meetings once a month
  sendReminders(){

    for(let i = 0 ; i < this.userV.length; i++)
    {
     if(this.userV[i].status == 4 || this.userV[i].status == 2)
      {
        if(this.DiffrenceDates(this.date, this.userV[i].dateSendRemider) >= 30 || this.userV[i].dateSendRemider == "")
        {
          let msg =  "שלום " +  this.userV[i].name
          if(this.userV[i].status == 4)
            msg += ",\nרצינו להזכיר לך לדווח באתר תאריכים של מפגשים שהתקיימו עם האזרח הותיק שהותאם לך,\nיש לבצע התחברות לאתר ולהיכנס לדף 'צפייה בהתאמות'\nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי"
          else
            msg += ",\nראינו שעדיין לא ביצעת מפגש עם האזרח הותיק שהותאם לך, הוא מחכה לך!\nלפרטים נוספים יש לבצע התחברות לאתר ולהיכנס לדף 'צפייה בהתאמות', שם צריך לעדכן האם המפגש התקיים \nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי"
         
          let sendEmail = firebase.functions().httpsCallable('sendSms');
    
          const db = firebase.firestore(); 
          db.collection('volunteerUsers').doc(this.userV[i].docID).update(
          {
            dateSendRemider: this.date
          }).catch((error) => {console.log(error)})
      
          sendEmail({number: "+972" + this.userV[i].phone , msg: msg}).then(function() {
          console.log("success calling sendSms1")
           }).catch(function(error) {
          console.log("error from calling sendSms1 functions - ", error.message)
          });

        }
      }
    }

    this.alert.sendReminder();
  }


  manual_matching()
  {
    const db = firebase.firestore();    

    if(this.matchE == null || this.matchV == null)
      this.alert.showError_manual_matching()

    else
    {
      
      db.collection("ElderlyUsers").doc(this.matchE).update({
          matching: {id: this.matchV, grade:"manual", date: this.date},
          status: 1
      }) .catch((error) => {console.log(error)})
      db.collection("volunteerUsers").doc(this.matchV).update({
          matching: this.matchE,
          status: 1,
          dateSendRemider: ""
      }) 

      let indexE = 0, indexV = 0;
      for(var i = 0 ; i < this.userE.length; i++){
        if(this.userE[i].manualM){
          this.userE[i].matching = {id: this.matchV, grade: "manual" ,date: this.date},
          this.userE[i].manualM = false;
          indexE = i
          break }
      }
   
      for(var i = 0 ; i <this.userV.length; i++){
        if(this.userV[i].manualM){
          indexV = i
          this.userV[i].manualM = false
          break}
      }

      // this.sendEmailsVolunteer(this.userV[indexV].name, this.userV[indexV].email)
      // if(this.userE[indexE].email != null)
      //   this.sendEmailsElder(this.userE[indexE].nameAssistant, this.userE[indexE].name, this.userE[indexE].email)
      // if(this.userV[indexV].phone.length == 9)
      //   this.sendSMS("+972" + this.userV[indexV].phone, this.userV[indexV].name)
      this.alert.showSuccessManual()
    }
  }


//check if the volunteer do not reject this eldely
  findIfReject(arr , idE)
  {
    if(arr != null)
    {
      for(let i = 0 ; i < arr.length; i++){
        if(arr[i].id == idE)
          return true;}
    }
      return false;
  }



  matchingAlgorithm()
  {
    

  

    // this.userE[0].matching = {id: this.userV[0].docID, grade: 5 ,
    // date: this.date, nameV: this.userV[0].name, phoneV: this.userV[0].phone}
    // console.log('this.userE[0].matching: ', this.userE[0].matching)
    // console.log('this.userE[0].name: ', this.userE[0].name)

    // let idV = this.userE[0].matching.id
    // const db = firebase.firestore();

    // db.collection('ElderlyUsers').doc(this.userE[0].docID).update(
    // {
    //     matching: this.userE[0].matching,
    //     status: -1
    //   }).catch((error) => {console.log(error)})
      
      
    // db.collection('volunteerUsers').doc(idV).update(
    // {
    //   matching: this.userE[0].docID,
    //   status: -1
    // }).catch((error) => {console.log(error)})

    // this.userE[0].status = -1
    // this.userV[0].status = -1


    const db = firebase.firestore();

    var numOfElderly = this.userE.length
    var numOfAlreadyMatched = 0
    var k=0;
    var ElderlyAlreadyChecked= new Array(); 
    ElderlyAlreadyChecked = [];
    var foundMatch = false
    

    this.userE.forEach(element => {
      if(element.status ==2 || element.status == 4 || element.matching.grade == "manual" )
        numOfAlreadyMatched = numOfAlreadyMatched + 1
    });

    console.log("numOfElderly1",numOfElderly)
    console.log("numOfAlreadyMatched1" , numOfAlreadyMatched)
    console.log(foundMatch)

    while(numOfElderly!=numOfAlreadyMatched){

      console.log("ENTER WHILE")
      console.log("numOfElderly2",numOfElderly)
      console.log("numOfAlreadyMatched2" , numOfAlreadyMatched)

      this.userV.forEach(volunteer => {
        
        ElderlyAlreadyChecked = [];

        console.log("numOfElderly3",numOfElderly)
        console.log("numOfAlreadyMatched3" , numOfAlreadyMatched)

        if(volunteer.status == 2 || volunteer.status == 4 )  //Check if there is match for this vol
            foundMatch = true
        else
            foundMatch = false

        console.log("volunteer: ",volunteer.name , " foundMatch" , foundMatch)

        while(!foundMatch){

            let arrMatch = [], elderlyIndex; 
            arrMatch = this.findMatches(volunteer.index , ElderlyAlreadyChecked)
            elderlyIndex = arrMatch[0]

            let checkMatch = this.userE[elderlyIndex].matching
            let checkStatus = this.userE[elderlyIndex].status

            console.log("ElderlyAlreadyChecked", ElderlyAlreadyChecked)


            console.log("arrMatch :", arrMatch)
            console.log("elderlyIndex :", elderlyIndex)
            console.log("this.userE[elderlyIndex].matching.id :", this.userE[elderlyIndex].matching.id)
            console.log("this.userE[elderlyIndex].matching.grade" , this.userE[elderlyIndex].matching.grade)

          if(this.userE[elderlyIndex].matching.id == '37niZDIXB6WohK42OFV7sifAXhZ2')
              console.log("MANUAL")

          if(this.userE[elderlyIndex].matching.grade != 'manual' || this.userE[elderlyIndex].status != 4 || this.userE[elderlyIndex].status != 2){ 
            if(this.userE[elderlyIndex].matching.id == ""){  //if there is no match for the first elderly
                numOfAlreadyMatched = numOfAlreadyMatched + 1
                console.log("numOfAlreadyMatched = numOfAlreadyMatched + 1" , numOfAlreadyMatched)
                
                this.userE[elderlyIndex].matching = {id: volunteer.docID, grade: arrMatch[1] ,
                                date: this.date, nameV: volunteer.name, phoneV: volunteer.phone}
                this.userE[elderlyIndex].status = -1
                foundMatch = true
                ElderlyAlreadyChecked = [];
              
              }
              else{           //if there is already match for this elderly
                if(this.userE[elderlyIndex].matching.grade >= arrMatch[1]){  //If the existing grade is higher than the new grade
                  
                  console.log("HIGHER")
                  ElderlyAlreadyChecked.push(this.userE[elderlyIndex].docID)
                  foundMatch = false
                }
                else{
                  console.log("LOWER")
                  

                  this.userE[elderlyIndex].matching = {id: volunteer.docID, grade: arrMatch[1] ,
                                                            date: this.date, nameV: volunteer.name, phoneV: volunteer.phone}
                  
                  foundMatch = true
                  ElderlyAlreadyChecked = [];
                }
              }

            }
        }
    });
    // for(let k = 0; k < this.userE.length; k++) //update the best 'matching' in documents
    // { 
    //   //if 'matching' is empty and no found match or matching is confirm - status
    //   if(this.userE[k].matching.id != "" && (this.userE[k].status != 2 && this.userE[k].status != 4 ))
    //   {
    //     console.log(this.userE[k].matching)
    //     let idV = this.userE[k].matching.id

    //       db.collection('ElderlyUsers').doc(this.userE[k].docID).update(
    //       {
    //           matching: this.userE[k].matching,
    //           status: 1
    //         }).catch((error) => {console.log(error)})
      
      
    //     db.collection('volunteerUsers').doc(idV).update(
    //     {
    //       matching: this.userE[k].docID,
    //       status: 1
    //     }).catch((error) => {console.log(error)})
    //   }
    // }

  
    // for(let i = 0 ; i < this.userE.length; i++) //for sending emails and sms
    // {
    //   if(this.userE[i].matching.id != "" && (this.userE[i].status != 2 && this.userE[i].status != 4 ))
    //   {
    //     //this.sendEmailsVolunteer(this.userE[i].matching.nameV, "chenfriedman93@gmail.com")
    //     // if(this.userE[i].email != null)
    //     //   this.sendEmailsElder(this.userE[i].nameAssistant, this.userE[i].nameV, "chenfriedman93@gmail.com")
    //     //this.sendSMS("+972" + this.userE[i].matching.phoneV, this.userE[i].matching.name)
    //   }
    // }

      this.alert.showSuccessAlgorithm();
      this.presentModalMatch();

  } 
  }


  //the method find the 3 best matches for all volunteer and save it in 'arrMatch'
  findMatches(i, ElderlyAlreadyChecked)
  {
      var alreadyChecked = false;
      var bestElderlyIndex = -1;
      let arrMatch = []
      let higherGrade=0 

      for(let l = 0; l < this.userE.length; l++)
      { 
        console.log("this.userE[l].docID  : " , this.userE[l].docID  )
        console.log("ElderlyAlreadyChecked[0]: " , ElderlyAlreadyChecked[0])
        
        for(let k=0 ; k<ElderlyAlreadyChecked.length ; k++){
            console.log("ENTER FOR ALREADY")
            if(this.userE[l].docID.toString() == ElderlyAlreadyChecked[k]){
                alreadyChecked = true
                console.log("ENTER ALREADY")
                break
            }
        }

        if(!alreadyChecked && this.userE[l].status != 2 && this.userE[l].status != 4){
          let res = 0 ,grade = 0
            console.log("volunteer name: ", this.userV[i].name + "\nelderly name: ", this.userE[l].name)
            
            if(this.parameters[0].currentValue) //days
            {
              res = this.checkMatchArr(this.userV[i].dayOfMeeting, this.userE[l].dayOfMeeting)
              if(this.parameters[0].Threshold && res == 0)
                  continue;
              else
              {
                grade += res
                res = 0
                console.log("after days ", grade)  
              }
                
            }

            if(this.parameters[1].currentValue) //hours  
            {
                res = this.checkMatchArr(this.userV[i].hours, this.userE[l].hours) //hours
                if(this.parameters[1].Threshold && res == 0)
                  continue
                else
                {
                  grade += res
                  res = 0  
                  console.log("after hours ", grade)
                }
            }
          

            if(this.parameters[2].currentValue)//meeting with 
            {
              res = this.checkMeetingWithArr(this.userV[i].meetingWith, this.userE[l].meetingWith)
              if(this.parameters[2].Threshold  && res == 0)
                continue;
              else
              {
                grade += res
                res = 0
                console.log("after meetingwith ", grade)
              }
            }  
      
            if(this.parameters[3].currentValue) //hobbies
            {
              res = this.checkMatchArr(this.userV[i].hobbies, this.userE[l].hobbies)
              if(this.parameters[3].Threshold  && res == 0)
                continue
              else
              {
                grade += res
                res = 0
                console.log("after hobbies ", grade)
                grade += this.checkMatchArr(this.userV[i].musicStyle, this.userE[l].musicStyle) //music style
                console.log("after music style ", grade)
              }
            }

            if(this.parameters[4].currentValue) //language
            {
              res = this.checkMatchArr(this.userV[i].language, this.userE[l].language) 
              if(this.parameters[4].Threshold  && res == 0)
                continue
              else
              {
                grade += res
                res = 0
                console.log("after language ", grade)
              }
            }

            console.log("totle grade is: ", grade)
          
            if(higherGrade <= grade){
              bestElderlyIndex = l
              higherGrade = grade
            }
            else if(bestElderlyIndex == -1)
              bestElderlyIndex = l
            
            // let j = 0 
            // let temp = {"grade": grade, "id": this.userE[l].docID, index: l}
            // if(j < 3)
            // {
            //   //insert temp to arrMatch with sorting way
            //   this.sortArr(arrMatch, j , temp , grade)
            //   j++;
            // }
            // else // check if the grade need to inserted to arrMatch
            //   this.update_gradesArr(arrMatch, grade, temp)
        }
      
  }
  arrMatch[0] = bestElderlyIndex
  arrMatch[1] = higherGrade

  return arrMatch
}




   //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsVolunteer(username, email)
  {
    let text = "שלום "+ username +",\nרצינו לעדכן אותך שמצאנו לך התאמה :)\n" +
    "לפרטים נוספים לחץ/י על הקישור ובצע/י התחברות עם כתובת המייל והסיסמה שלך\n" +
    "לאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות' bit.ly/2WDBZTZ \n\n" +
    "תודה על שיתוף הפעולה,\n" +
    "שמחת זקנתי"

    let subject =  "נמצאה לך התאמה באתר שמחת זקנתי!"

    let sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail({email: email, subject: subject, text: text}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendEmail functions - ", error.message ,error.code)
    });
  }



  //this code is call sendEmail (firebase Functions) from backend 
  sendEmailsElder(username , nameE, email)
  {
    let text = "שלום "

    if(username != undefined)
      text += username +",\n";   
    else
      text += nameE +",\n";

    if(username != nameE && username != undefined)
    {
      text +="רצינו לעדכן אותך שנמצאה התאמה עבור אזרח ותיק שרשמת באתר שלנו"
      if(nameE != "חסוי")
        text += " - " + nameE;

      text +=  "\nבימים הקרובים יצרו עמכם קשר\n\n"
    }
    
    else
      text += "רצינו לעדכן אותך שנמצאה עבורך התאמה :) \nבימים הקרובים יצרו עימך קשר,\n\n"

    text +="בברכה,\nצוות שמחת זקנתי"

    let subject =  "נמצאה התאמה באתר שמחת זקנתי!"

    let sendEmail = firebase.functions().httpsCallable('sendEmail');
    sendEmail({email: email, subject: subject, text: text}).then(function(result) {
      console.log("success calling sendEmail - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendEmail functions - ", error.message ,error.code)
    });
  }



  //this code is call sendSms (firebase Functions) from backend
  sendSMS(number , name)
  {
    let msg =  "שלום " + name + ",\nנמצאה לך התאמה באתר שמחקת זקנתי!\nלפרטים נוספים יש להיכנס לאתר ולבצע התחברות עם כתובת מייל וסיסמה\nלאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות'\nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי"
    let sendEmail = firebase.functions().httpsCallable('sendSms');

    sendEmail({number: number , msg: msg}).then(function(result) {
      console.log("success calling sendSms1 - ", result.data)
    }).catch(function(error) {
      console.log("error from calling sendSms1 functions - ", error.message ,error.code)
    });
  }



  checkMeetingWithArr(vol, elder)
  {
    let grade = 0
    if(vol == 1 || elder == 1) //לא משנה עם מי להיפגש
      grade = 1
    else if(vol == 2 && elder == 2) //נשים בלבד
      grade = 1
    else if(vol == 3 && elder == 3) //גברים בלבד
      grade = 1

    return grade
  }



  checkMatchArr(arrV, arrE)
  {
    let grade = 0
      for(let i = 0 ; i < arrV.length; i++)
      {
        if(arrV[i].currentValue && arrE[i].currentValue)
          grade+= 1
      }
    return grade;
  }



  // //insert new grade to array in sort way
  // update_gradesArr(arr, grade, temp)
  // {
  //     if(grade >= arr[0].grade)
  //     {
  //       arr[2] = arr[1]
  //       arr[1] = arr[0]
  //       arr[0] = temp
  //     }
  //     else if(grade <= arr[1].grade && grade >= arr[2].grade)
  //     arr[2] = temp

  //     else if(grade < arr[0].grade && grade >= arr[1].grade)
  //     {
  //       arr[2] = arr[1]
  //       arr[1] = temp
  //     }
  //     return arr
  // }


  // // The method puts the first three grades in an sort way
  // sortArr(arrMatch, j , temp , grade)
  // {
  //   if(j == 0)
  //     arrMatch[0] = temp

  //   else if(j == 1)
  //   {
  //     if(grade > arrMatch[0].grade)
  //     {
  //       arrMatch[1] = arrMatch[0]
  //       arrMatch[0] = temp
  //     }
  //     else if(grade <= arrMatch[0].grade)
  //       arrMatch[1] = temp
  //   }

  //   else if (j == 2)
  //   {
  //     if(grade >= arrMatch[0].grade)
  //     {
  //       arrMatch[2] = arrMatch[1]
  //       arrMatch[1] = arrMatch[0]
  //       arrMatch[0] = temp
  //     }
  //     else if(grade < arrMatch[0].grade && grade >= arrMatch[1].grade)
  //     {
  //       arrMatch[2] = arrMatch[1]
  //       arrMatch[1] = temp
  //     }
  //     else 
  //       arrMatch[2] = temp
  //   }
  // }
  
}