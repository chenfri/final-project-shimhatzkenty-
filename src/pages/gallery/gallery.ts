import { Component } from '@angular/core';
import { IonicPage,ToastController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../module/User'
import { HomePage } from '../home/home';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';


@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {
  @ViewChild(Slides) slides: Slides;

  user = {} as User;


  constructor(private toast: ToastController  ,public navCtrl: NavController, public navParams: NavParams) {
    
  
  }

  ionViewDidLoad() {
   

  }

 
    //if the user press on home page button and he didn't finish fill the form
  click_home()
  {
    
      this.navCtrl.push(HomePage, {
       'login': this.user.loggedIn, 'elderly': this.user.elderly,
      'volunteer': this.user.volunteer
  })
  }
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
   };


}
