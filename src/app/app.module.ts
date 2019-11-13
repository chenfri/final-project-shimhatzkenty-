import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Form } from '../pages/form/form';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {RegisterPage} from '../pages/register/register'
import {LoginPage} from '../pages/login/login'

//import { AngularFireAuth } from 'angularfire2/auth'

//import { Firebase } from '@ionic-native/firebase';
import {AngularFireModule} from 'angularfire2'
import {AngularFireAuthModule} from 'angularfire2/auth'

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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Form,
    RegisterPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  //  AngularFireAuth
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Form,
    RegisterPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
