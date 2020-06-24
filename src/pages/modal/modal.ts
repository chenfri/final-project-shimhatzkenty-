import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { NavParams} from 'ionic-angular';
import {AlertProvider} from '../../providers/alert/alert'

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})

export class ModalPage {
  public whichPage: string;
  public parameters: any[];

  constructor(params: NavParams,private modal: ViewController, public alert: AlertProvider) {
    this.whichPage = params.get('whichPage')
    console.log('whichPage', this.whichPage);

    this.parameters = [{
      'species': 'ימים',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שעות',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'מעוניין להיפגש עם',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'תחומי עניין',
      'currentValue': false,
      'Threshold' : false
    },{
      'species': 'שפות',
      'currentValue': false,
      'Threshold' : false
    }]

  }

  async closeModal()
  {
    this.modal.dismiss("closed")
  }



  async passParams()
  {
    let chosen = false
    for(let i = 0 ; i < this.parameters.length; i++)
      if(this.parameters[i].currentValue)
        chosen = true

    if(!chosen)
      this.alert.error_params();
    else
      this.modal.dismiss(this.parameters );
  }

  
  radioClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(!element.Threshold && element.currentValue)
          element.Threshold = true
        else
          element.Threshold = false
      }
    });

    console.log('parameters',this.parameters) 
  }


  CheckboxClicked(item: any)
  {
    this.parameters.forEach(element => {
      
      if(element == item){
        if(element.currentValue)
          element.currentValue = false
        else
          element.currentValue = true
      }
    });

    //console.log('parameters',this.parameters) 
  }
}