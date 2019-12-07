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
    this.userV = this.navParams.get('volunteer');
    let temp = [["1","2"],["2","3"],["4","5"],["6","7"]]
    this.extractData(temp)
  }

  private readCsvData() {
    this.http.get( 'assets/test.csv')
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }
 
  private extractData(res) {
    let csvData =  res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
    this.headerRow = parsedData[0]
    this.headerRow = ["name","adrress" , "phone"]
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
 
  downloadCSV() {
    let temp = [["1","2"],["2","3"],["4","5"],["6","7"]]
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
 
  setArray()
  {
    let arr = []

    for(let i = 0 ; i < 4 ; i ++)
      arr.push([this.userE[i]])
    console.log(arr)
  }

  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }
 
}
