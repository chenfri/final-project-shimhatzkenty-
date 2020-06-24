import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { NavParams} from 'ionic-angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})
export class ModalPage {
  public whichPage: string;
  public parameters:any[];

  constructor(params: NavParams,private modal: ViewController) {
    this.whichPage = params.get('whichPage')
    console.log('whichPage', this.whichPage);

    this.parameters =   [{
      'species': 'days',
      'currentValue': false
    },{
      'species': 'hours',
      'currentValue': false
    },{
      'species': 'meetingWith',
      'currentValue': false
    },{
      'species': 'hobbies',
      'currentValue': false
    },{
      'species': 'language',
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
    this.parameters.forEach(element => {
      
      if(element.species == item){
        element.currentValue =true
      }
      else{
        element.currentValue =false
      }
 

      
    });

    console.log('parameters',this.parameters)
    
}
}