import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams} from 'ionic-angular';
import firebase, { firestore } from 'firebase';
import { map } from 'rxjs/operator/map';
import {AngularFirestore} from 'angularfire2/firestore'
import { AngularFirestoreDocument, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Http } from '@angular/http';
import * as papa from 'papaparse';

@Component({
  selector: 'adminPage',
  templateUrl: 'adminPage.html' ,
})

export class adminPage
 {
  userE = {} as User;
  userV = {} as User;
  public hobbies: any[] 
  public time: any[]
  public numOfMeeting: any[]
  posts :any
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) 
  {
    this.userE = this.navParams.get('eldely');
   // console.log(this.userE)
    this.userV = this.navParams.get('volunteer');
    //console.log(this.userV)
    //this.readCsvData();
  }
  // private readCsvData() {
  //   this.http.get( this.userE.toString())
  //     .subscribe(
  //     data => this.extractData(data),
  //     err => this.handleError(err)
  //     );
  // }
 
  // private extractData(res) {
  //   let csvData =  this.userE.toString();//res['_body'] || '';
  //   let parsedData = papa.parse(csvData).data;
  //   this.headerRow = ["name","adrress","telephone"]
 
  //   parsedData.splice(0, 1);
  //   this.csvData = parsedData;
  // }
 
  downloadCSV() {
    let temp = "chen"
   // let csvData =  temp.toString();//res['_body'] || '';
   // let parsedData = papa.parse(csvData).data;
    //console.log(csvData);

    this.headerRow = ["name","adrress"]

    //parsedData.splice(0, 1);
    //this.csvData = parsedData;
  
    let csv = papa.unparse({
      fields: this.headerRow,
      data: temp,
       });
 
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 
  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }
 
}
