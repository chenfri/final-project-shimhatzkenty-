import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { NavParams} from 'ionic-angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})

export class ModalPage {
  public whichPage: string;
  public parameters: any[];

  constructor(params: NavParams,private modal: ViewController) {
    this.whichPage = params.get('whichPage')
    console.log('whichPage', this.whichPage);

    this.parameters = [{
      'species': 'ימים',
      'currentValue': false
    },{
      'species': 'שעות',
      'currentValue': false
    },{
      'species': 'מעוניין להיפגש עם',
      'currentValue': false
    },{
      'species': 'תחומי עניין',
      'currentValue': false
    },{
      'species': 'שפות',
      'currentValue': false
    }]

  }

  async closeModal()
  {
    this.modal.dismiss({
        'dismissed': true
      });
  }


  CheckboxClicked(item: any)
  {
    console.log(item)
    this.parameters.forEach(element => {
      
      if(element == item){
        if(element.currentValue)
          element.currentValue = false
        else
          element.currentValue = true
      }
    });

    console.log('parameters',this.parameters)
    
  }
}