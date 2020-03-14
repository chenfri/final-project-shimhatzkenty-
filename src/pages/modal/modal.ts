import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
})
export class ModalPage {

  constructor(private modal: ViewController) {

  }

  async closeModal()
  {
    this.modal.dismiss({
        'dismissed': true
      });
  }

}