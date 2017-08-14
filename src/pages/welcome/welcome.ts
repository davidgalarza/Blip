import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { WherePage } from '../../pages/where/where';
import { HTTP } from '@ionic-native/http';

/**
 * WELCOME-PAGE
 * This page triger the AccountKit to signin the user
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private http: HTTP) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
  acept(){
    // Use AccountKitPlugin to login the user.
    (<any>window).AccountKitPlugin.loginWithPhoneNumber({
      useAccessToken: true,
      defaultCountryCode: "EC",
      facebookNotificationsEnabled: true,
      initialPhoneNumber: ["593", ""]
    }, (info)=>{
      // HTTP request to a Firebase Funtion, to generate a CustomToken
      this.http.get('https://us-central1-atiempo-5533e.cloudfunctions.net/getCustomToken?access_token='+info.token,{},{}).then((data)=>{
       this.auth.signinWithToken(data.data).then((ss)=>{
          this.navCtrl.setRoot(WherePage);
        });
      }).catch((err)=>{
        console.log(err)
      });
      
    }, (err)=>{
      console.log(err)
    });
  }
}
