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
  
  send()
  {

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });

    let email = {
      to: 'chenfriedman93@gmail.com',
      cc: 'chenfriedman93@gmail.com',
      bcc: [],
      attachments: [],
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
    
    

}
