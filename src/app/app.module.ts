import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgImageSliderModule } from 'ng-image-slider';
import { MyApp } from './app.component';

import { Form } from '../pages/form/form';
import { HomePage } from '../pages/home/home';
import {RegisterPage} from '../pages/register/register'
import {LoginPage} from '../pages/login/login'
import {contactPage} from '../pages/contactPage/contactPage'
import {adminPage} from '../pages/Admin/adminPage';

import { GooglePlus } from '@ionic-native/google-plus';
import { Geolocation } from '@ionic-native/geolocation';
//import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import * as firebase from 'firebase';
import {AngularFireAuthModule} from 'angularfire2/auth'
import {AngularFireModule} from 'angularfire2'
import { HttpModule } from '@angular/http';
import { AlertProvider } from '../providers/alert/alert';
import {Functions} from '../providers/functions'

export const firebaseConfig = {
    apiKey: "AIzaSyDYpEw_jy9bhMFXZ0hTMJRay8hu_OHq6Fw",
    authDomain: "simhat-zkenty.firebaseapp.com",
    databaseURL: "https://simhat-zkenty.firebaseio.com",
    projectId: "simhat-zkenty",
    storageBucket: "simhat-zkenty.appspot.com",
    messagingSenderId: "377941126479",
    appId: "1:377941126479:web:4b32632e785588e817e93a",
    measurementId: "G-JX2HFFMHP9"
  };

  firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Form,
    RegisterPage,
    LoginPage,
    contactPage,
    adminPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    NgImageSliderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Form,
    contactPage,
    RegisterPage,
    LoginPage,
    adminPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    // Facebook,
    AlertProvider,
    Functions,
    Geolocation,
    //NativeGeocoder,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AlertProvider
  ]
})
export class AppModule {}
