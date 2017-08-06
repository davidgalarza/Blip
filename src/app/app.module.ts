import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPageModule } from '../pages/login/login.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { WherePageModule } from '../pages/where/where.module';
import { DirectionsManagerPageModule } from '../pages/directions-manager/directions-manager.module';
import { AddDirectionPageModule } from '../pages/add-direction/add-direction.module';
// Import AngularFire Library
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Firebase } from '@ionic-native/firebase'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';


// Firebase credentials
export const firebaseConfig = {
    apiKey: "AIzaSyD5-GtfArEanLasYBxACCsKZCAwX_lQp3I",
    authDomain: "atiempo-5533e.firebaseapp.com",
    databaseURL: "https://atiempo-5533e.firebaseio.com",
    projectId: "atiempo-5533e",
    storageBucket: "atiempo-5533e.appspot.com",
    messagingSenderId: "212855483806"
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    //LoginPage,
    //WelcomePage,
    //WherePage,
    //DirectionsManagerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    LoginPageModule,
    WelcomePageModule,
    WherePageModule,
    DirectionsManagerPageModule,
    AddDirectionPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    //LoginPage,
    //WelcomePage,
    //WherePage,
   // DirectionsManagerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Firebase
  ]
})
export class AppModule {}
