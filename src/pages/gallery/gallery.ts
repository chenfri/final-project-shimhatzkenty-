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
   @ViewChild('slideWithNav2') slideWithNav2: Slides;
  sliderTwo: any;

  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true
  };

  constructor(private toast: ToastController  ,public navCtrl: NavController, public navParams: NavParams) { 
  
    this.sliderTwo =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 6,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery1.jpg?alt=media&token=6b05cdc4-dfe9-48aa-bc90-dbf57f09d13d"
        },
        {
          id: 7,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery2.jpg?alt=media&token=db4466ef-8562-4a72-ac7c-610d76145ae3"
        },
        {
          id: 8,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery3.jpeg?alt=media&token=535a5ebe-d50f-4ed8-83f8-8c1a180c48ad"
        },
        {
          id: 9,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery4.jpg?alt=media&token=0b08c6fb-fb2f-4b8d-8d1c-7f7fd3fab742"
        },
        {
          id: 10,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery5.jpeg?alt=media&token=a63d271a-f99e-4e66-a427-2fc0caae1e2a"
        },
        {
          id: 11,
          image: "https://firebasestorage.googleapis.com/v0/b/simhat-zkenty.appspot.com/o/galleryPics%2Fgallery6.jpeg?alt=media&token=393426b0-b911-449c-ab9a-a3f90ffc827e"
        }
      ]
    };

  }


  click_home()
  {
    
      this.navCtrl.push(HomePage/*, {
       'login': this.user.loggedIn, 'elderly': this.user.elderly,
      'volunteer': this.user.volunteer
  }*/)
  }


   
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
