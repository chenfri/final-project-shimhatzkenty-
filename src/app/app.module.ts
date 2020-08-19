import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgImageSliderModule } from 'ng-image-slider';
import { MyApp } from './app.component';

import { MatchPage} from '../pages/match/match';
import { ReportMatchesPage } from '../pages/report-matches/report-matches';
import { Form } from '../pages/form/form';
import { HomePage } from '../pages/home/home';
import {RegisterPage} from '../pages/register/register'
import {LoginPage} from '../pages/login/login'
import {contactPage} from '../pages/contactPage/contactPage'
import {adminPage} from '../pages/Admin/adminPage';
import { ModalPage } from '../pages/modal/modal';
import {PopoverPage} from '../pages/popover/popover';
import { IonicSelectableModule } from 'ionic-selectable';

import * as firebase from 'firebase';
import {AngularFireAuthModule} from 'angularfire2/auth'
import {AngularFireModule} from 'angularfire2'
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http'
import { AlertProvider } from '../providers/alert/alert';
import {Functions} from '../providers/functions'
import {Arrays} from '../providers/arrays'
import {SelectSearchableModule} from 'ionic-select-searchable'

export const firebaseConfig = {
  apiKey: "",
  authDomain: "simhat-zkenty.firebaseapp.com",
  databaseURL: "https://simhat-zkenty.firebaseio.com",
  projectId: "simhat-zkenty",
  storageBucket: "simhat-zkenty.appspot.com",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
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
    adminPage,
    ModalPage,
    MatchPage,
    PopoverPage,
    ReportMatchesPage
  ],
  imports: [ 
    FormsModule,  
    BrowserModule,
    SelectSearchableModule,
    IonicModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    HttpClientModule,
    NgImageSliderModule,
    IonicSelectableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Form,
    contactPage,
    RegisterPage,
    LoginPage,
    adminPage,
    ModalPage,
    PopoverPage,
    MatchPage,
    ReportMatchesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlertProvider,
    Functions,
    Arrays,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
