import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase/app';
import { Form } from '../pages/form/form';
import {RegisterPage} from '../pages/register/register'
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = RegisterPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      firebase.initializeApp({
        apiKey: "AIzaSyDYpEw_jy9bhMFXZ0hTMJRay8hu_OHq6Fw",
        authDomain: "simhat-zkenty.firebaseapp.com",
        databaseURL: "https://simhat-zkenty.firebaseio.com",
        projectId: "simhat-zkenty",
        storageBucket: "simhat-zkenty.appspot.com",
        messagingSenderId: "377941126479",
        appId: "1:377941126479:web:4b32632e785588e817e93a",
        measurementId: "G-JX2HFFMHP9"
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

