import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Form } from '../form/form';
import { contactPage } from '../contactPage/contactPage'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  form() {
    this.navCtrl.push(Form);
  }
  contactPage() {
    this.navCtrl.push(contactPage);
  }



}
