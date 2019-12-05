import { Component } from '@angular/core';
import { User } from '../../module/User'
import { NavController,NavParams} from 'ionic-angular';
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
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) 
  {
    this.userE = this.navParams.get('eldely');
   // console.log(this.userE)
    this.userV = this.navParams.get('volunteer');
    //console.log(this.userV)
   this.readCsvData();

  }

  private readCsvData() {
    let temp = [[12,1],[1,2]]
    this.http.get( temp.toString())
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }
 
  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.headerRow = ["name","adrress"]
 
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
 

  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.csvData 
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
