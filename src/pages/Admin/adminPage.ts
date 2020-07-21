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
  public elderMatches: any[] = []
  public elderMatchesIndex: any[] = []
  public volMatchesIndex: any[] = []
  public androidPlat = false

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController ,
     public alert: AlertProvider, private event: Events, public popoverCtrl: PopoverController,
     public modalController: ModalController, public platform: Platform) 
  {
    //inialize variables
    this.matchE = null;
    this.matchV = null;
    this.date = new Date().toISOString().substring(0, 10);

    if (this.platform.is('android'))
      this.androidPlat = true;
  }


  ngOnInit()
  { 
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

    this.getVolMatchesIndex();
    console.log('this.volMatchesIndex', this.volMatchesIndex)
    this.getElderlyMatchesIndex();
    console.log('this.elderMatchesIndex', this.elderMatchesIndex)

    this.getElderlyTempMatches();
    console.log('this.elderMatches', this.elderMatches)
 

    this.reverseDates(); 

    let j = 0; //arrange array of students (because the style of the table)
    for(let i = 0 ; i < this.userV.length; i++)
    {
      if(this.userV[i].student){
        this.studentArr[j] = this.userV[i]
        j++}
    }
  }


  //the method return array that every index represent volunteer
  // in cell we write the index of matcing elderly
  getVolMatchesIndex()
  {
    for(var i = 0; i < this.userV.length; i++)
    {

      if(this.userV[i].status != 0) 
      {
        var eID = this.userV[i].matching;

        for(var j = 0 ; j < this.userE.length; j++)
        {        
     
            if(this.userE[j].docID.localeCompare(eID) == 0){
              this.volMatchesIndex.push(j); 
              break;}       
        }
      }
      else
          this.volMatchesIndex.push(-1); 
    }
}





  //the method return array that every index represent elderly
  // in cell we write the index of matcing volunteer
  getElderlyMatchesIndex()
  {
    for(var i = 0; i < this.userE.length; i++)
    {
      if(this.userE[i].status != 0) 
      {
        var volID = this.userE[i].matching.id;
        var push = false;

        for(var j = 0 ; j < this.userV.length; j++)
        {      
            if(this.userV[j].docID.localeCompare(volID) == 0 ){
            this.elderMatchesIndex.push(j); 
              push = true; }
        } 
      }

      else
          this.elderMatchesIndex.push(-1); }
  }



//the method find all temporary matching in status 1 (not manually) and 1-
  getElderlyTempMatches()
  {
    this.userE.forEach(elder => {
      if((elder.status == 1 &&  elder.matching.grade != 'manual')|| elder.status == -1)
      {
        let IndexdMatch = -1
        for(let i = 0 ; i < this.userV.length ; i++)
        {
          if(this.userV[i].docID == elder.matching.id){
            IndexdMatch = i
            break;           
          }
        }
        this.elderMatches.push([elder.matching.grade , IndexdMatch])
      }
      else if(elder.status == 0)
        this.elderMatches.push([0 , -1])
      else
        this.elderMatches.push([-1 , -1])
    });
  
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
console.log("index: ", index)
            if(this.userE[index].status != 0) 
            {
              
              let volId= this.userE[index].matching.id
              console.log("volId: ", volId)
              let volIndex = this.elderMatchesIndex[index]
              console.log("volIndex: ", volIndex)
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
             if(this.userV[index].status != 0) 
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

      this.sendEmailsVolunteer(this.userV[indexV].name, this.userV[indexV].email)
      if(this.userE[indexE].email != null)
        this.sendEmailsElder(this.userE[indexE].nameAssistant, this.userE[indexE].name, this.userE[indexE].email)
      if(this.userV[indexV].phone.length == 9)
        this.sendSMS("+972" + this.userV[indexV].phone, this.userV[indexV].name)
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
    const db = firebase.firestore();
    let numOfAlreadyMatched = 0, numOfUsers = 0 

    if(this.userV.length >= this.userE.length) //for while Stop condition
      numOfUsers = this.userE.length
    else
      numOfUsers = this.userV.length

    for(let k = 0; k < this.userE.length; k++)//counts number of exist matcings
    {
      if(this.userE[k].status == 2 || this.userE[k].status == 4 || this.userE[k].matching.grade == 'manual' )
        numOfAlreadyMatched += 1

      else if(this.userE[k].status == -1) //reset prev matching
      {
        this.userE[k].matching = {id: "", grade: 0 ,date: ""} 
        this.userE[k].status = 0 
        let indexVol = this.elderMatches[k][1]
        this.elderMatches[k] = [0,-1]
        this.userV[indexVol].matching = null
        this.userV[indexVol].status = 0
      }
    }

    let counter = 0
    let breakLoop = false

    while(numOfUsers != numOfAlreadyMatched)
    {
      if(breakLoop)
        break;

      for(var i = 0 ; i < this.userV.length ; i++)
      {  
        if(counter == this.userV.length)
        {
          breakLoop = true;
          break
    }

        if(this.userV[i].docID == "GHM0fArihIblXhsfThh7C7cXwuL2" )
          console.log()
          
        let arrMatch = [-1,-1], elderlyIndex; 

        let indexElder = this.volMatchesIndex[i]
        console.log("i ",i)
        console.log("indexElder ",indexElder)
        if(indexElder != -1 ){
          if(this.userE[indexElder].matching.grade == "manual")
            continue;}
          
          

       //Check if there isn't match for this volunteer 
        if(this.userV[i].status != 2 && this.userV[i].status != 4 && this.userV[i].status != -2)
        {
          arrMatch = this.findMatches(i) //find the best elderly for this volunteer
          elderlyIndex = arrMatch[0]
          //console.log("arrMatch :", arrMatch)

          if(elderlyIndex != -1)
          {

            if(this.userE[elderlyIndex].matching.id == "") //if there is no match for elderly update new matching
            { 
                numOfAlreadyMatched += 1
                this.userE[elderlyIndex].status = -1
                this.elderMatches[elderlyIndex][0] = arrMatch[1]
                this.elderMatches[elderlyIndex][1] = i  
                this.userE[elderlyIndex].matching = {id: this.userV[i].docID, grade: arrMatch[1] ,date: this.date}  
                this.userV[i].status = -2 //כדי שלא נעבור על הקשיש הזה שוב באיטרציה הבאה      
   
              } 
              else //if this elderly has allready matching - in status -1 or 1 (not manually)
              { 
                //If the new grade is higher than the existing grade for this elderly
                if(this.elderMatches[elderlyIndex][0] < arrMatch[1])      
                {  
                  let prevVol = this.elderMatches[elderlyIndex][1] //remove the prev matching for vol
                  if(prevVol != -1){
                  this.userV[prevVol].status = 0
                  this.userV[prevVol].matching = null}

                  this.elderMatches[elderlyIndex][0]= arrMatch[1] //update the new macting
                  this.elderMatches[elderlyIndex][1]= i

                  this.userE[elderlyIndex].matching = {id: this.userV[i].docID, grade: arrMatch[1] ,
                                  date: this.date, nameV: this.userV[i].name, phoneV: this.userV[i].phone}
                  this.userV[i].matching =  this.userE[elderlyIndex].docID
                  this.userV[i].status = -2 //כדי שלא נעבור על הקשיש הזה שוב באיטרציה הבאה
                  this.userE[elderlyIndex].status = -1         
              }
             
            }
          }
          else
            counter++;
        }
      
      }
    } 

    //for save macting in DB
    for(let k = 0; k < this.userE.length; k++) 
    { 
      if(this.userE[k].status == -1)
      {
       // console.log(this.userE[k].matching)
        let idV = this.userE[k].matching.id

          db.collection('ElderlyUsers').doc(this.userE[k].docID).update(
          {
              matching: this.userE[k].matching,
              status: -1
            }).catch((error) => {console.log(error)})
      
      
          db.collection('volunteerUsers').doc(idV).update(
          {
            matching: this.userE[k].docID,
            status: -1
          }).catch((error) => {console.log(error)})
      }
    }

      console.log("this.elderMatches", this.elderMatches)
      this.alert.showSuccessAlgorithm();
      this.presentModalMatch();

  
  }


  //the method find the best matching for volunteer and save it in 'arrMatch'
  findMatches(indexVol)
  {
      var bestElderlyIndex = -1;
      let arrMatch = []
      let higherGrade = 0, currentGrade = 0, res = 0 ,grade = 0 , ifReject = false

      for(let l = 0; l < this.userE.length; l++)
      { 
        currentGrade = this.elderMatches[l][0]

        if(this.userE[l].status != 2 && this.userE[l].status != 4 && this.userE[l].matching.grade != 'manual')
        {
            res = 0 ,grade = 0 
           // console.log("volunteer name: ", this.userV[indexVol].name + "\nelderly name: ", this.userE[l].name)
           
           let rejected = this.userV[indexVol].rejected
           if(rejected != null)
           {
             for(let i = 0 ; i < rejected.length; i++)
             {
              if(rejected[i].id == this.userE[l].docID){
                console.log("rejeced: ",this.userE[l].name)
                ifReject = true;
                break;}
              }

              if(ifReject)
                continue
           }

            if(this.parameters[0].currentValue) //days
            {
              res = this.checkMatchArr(this.userV[indexVol].dayOfMeeting, this.userE[l].dayOfMeeting, 1)
              if(this.parameters[0].Threshold && res == 0)
                  continue;
              else
              {
                grade += res
                res = 0
               // console.log("after days ", grade)  
              }
                
            }

            if(this.parameters[1].currentValue) //hours  
            {
                res = this.checkMatchArr(this.userV[indexVol].hours, this.userE[l].hours, 0) //hours
                if(this.parameters[1].Threshold && res == 0)
                  continue
                else
                {
                  grade += res
                  res = 0  
                 // console.log("after hours ", grade)
                }
            }
          

            if(this.parameters[2].currentValue)//meeting with 
            {
              res = this.checkMeetingWithArr(this.userV[indexVol].meetingWith, this.userE[l].meetingWith)
              if(this.parameters[2].Threshold  && res == 0)
                continue;
              else
              {
                grade += res
                res = 0
               // console.log("after meetingwith ", grade)
              }
            }  
      
            if(this.parameters[3].currentValue) //hobbies
            {
              res = this.checkMatchArr(this.userV[indexVol].hobbies, this.userE[l].hobbies, 0)
              if(this.parameters[3].Threshold  && res == 0)
                continue
              else
              {
                grade += res
                res = 0
              //  console.log("after hobbies ", grade)
                grade += this.checkMatchArr(this.userV[indexVol].musicStyle, this.userE[l].musicStyle, 0) //music style
               // console.log("after music style ", grade)
              }
            }

            if(this.parameters[4].currentValue) //language
            {
              res = this.checkMatchArr(this.userV[indexVol].language, this.userE[l].language, 0) 
              if(this.parameters[4].Threshold  && res == 0)
                continue
              else
              {
                grade += res
                res = 0
              //  console.log("after language ", grade)
              }
            }

         //   console.log("volunteer name: ", this.userV[indexVol].name + "\nelderly name: ", this.userE[l].name)
         //   console.log("totle grade is: ", grade)
    

          if(higherGrade <= grade && grade > currentGrade)
          {
            // if(this.userV[indexVol].status == -1) // remove
            // {
            //   var x = this.volMatchesIndex[indexVol]

            //   if(x != -1){
            //    if(this.elderMatches[x][0] < grade)      
            //     { 
            //       this.userE[x].matching ={id: "", grade: 0 ,date: ""} 
            //       this.userE[x].status = 0 
            //       this.elderMatches[x] = [0,-1]
            //       this.volMatchesIndex[indexVol] = -1          
            //    }
            //   }
            // }
              bestElderlyIndex = l
              higherGrade = grade
            }
         
        }
      
    }
    
    if(this.userV[indexVol].status == -1 && bestElderlyIndex == -1)
      bestElderlyIndex = this.volMatchesIndex[indexVol]

    

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
    let msg =  "שלום " + name + ",\nנמצאה לך התאמה באתר שמחת זקנתי!\nלפרטים נוספים יש להיכנס לאתר ולבצע התחברות עם כתובת מייל וסיסמה\nלאחר מכאן לחץ/י בתפריט על 'צפייה בהתאמות'\nhttps://simhat-zkenty.firebaseapp.com\n\nצוות שמחת זקנתי"
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



  checkMatchArr(arrV, arrE , indexToStart)
  {
    let grade = 0
      for(let i = indexToStart ; i < arrV.length; i++)
      {
        if(arrV[i].currentValue && arrE[i].currentValue)
          grade+= 1
      }
    return grade;
  }

}