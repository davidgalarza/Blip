import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { WherePage } from '../../pages/where/where';
import { HTTP } from '@ionic-native/http';
import { Firebase } from '@ionic-native/firebase';

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
  acceptedTerms: boolean = true;
  name: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private http: HTTP, public db: DatabaseProvider, public load: LoadingController,  private firebase: Firebase,  public toastCtrl: ToastController, public menu: MenuController) {
    this.menu.enable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }
  pushWherePage(){
    console.log("click");
    this.navCtrl.setRoot(WherePage);
    this.navCtrl.popToRoot();
  }
  acept(){
    // Use AccountKitPlugin to login the user.
    (<any>window).AccountKitPlugin.loginWithPhoneNumber({
      useAccessToken: true,
      defaultCountryCode: "EC",
      facebookNotificationsEnabled: true,
      initialPhoneNumber: ["593", ""]
    }, (info)=>{
      let loading = this.load.create({
        content: 'Creando tu cuenta...'
      });
      loading.present();
      // HTTP request to a Firebase Funtion, to generate a CustomToken
      this.http.get('https://us-central1-atiempo-5533e.cloudfunctions.net/getCustomToken?access_token='+info.token,{},{}).then((data)=>{
       this.auth.signinWithToken(data.data).then((ss)=>{
         (<any>window).AccountKitPlugin.getAccount(user=>{
          this.db.createFirstUserData(ss.uid, user.phoneNumber).then(ss=>{
            this.firebase.setUserId(this.auth.getUser().uid).then(user=>{
              console.log(user);
              loading.dismiss().then(()=>{
                this.navCtrl.setRoot(WherePage);
                this.navCtrl.popToRoot();
              });
            });
          });
         }, err=>{
          console.log(err);
         });
          
        });
      }).catch((err)=>{
        console.log(err)
      });
      
    }, (err)=>{
      console.log(err)
    });
  }
  loginPhone(){
    if(this.name.length == 0){
      const toast1 = this.toastCtrl.create({
        message: 'Dinos tu nombre para conocerte mejor',
        duration: 3000,
        position: 'top',
        cssClass: "infoWin"
      });
    
      toast1.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast1.present();
    }else{
      if(!this.acceptedTerms){
        const toast = this.toastCtrl.create({
          message: 'Debes acetar los Términos y condiciones',
          duration: 3000,
          position: 'top',
          cssClass: "infoWin"
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }else{
        this.acept();
      }
    }
    
  }

}
