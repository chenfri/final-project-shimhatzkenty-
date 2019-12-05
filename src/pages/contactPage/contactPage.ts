import { Component } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Component({
  selector: 'contact-page',
  templateUrl: 'contactPage.html' ,
})

export class contactPage
 {
 
  constructor(private emailComposer: EmailComposer){

  }

    
  
}
