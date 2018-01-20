import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { WherePage } from '../../pages/where/where';
import { HTTP } from '@ionic-native/http';
import { Firebase } from '@ionic-native/firebase';
import { HomePage } from '../../pages/home/home';

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
  message: string;
  gift:number; 
  constructor(private platform: Platform,public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private http: HTTP, public db: DatabaseProvider, public load: LoadingController,  private firebase: Firebase,  public toastCtrl: ToastController, public menu: MenuController) {

        this.menu.enable(false);

    this.message = this.navParams.get('message');
    console.log(this.message);
    if(this.message != undefined){
      const toast = this.toastCtrl.create({
        message: this.message,
        duration: 3000,
        position: 'top',
        cssClass: "infoWin"
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }
    

    
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad WelcomePage');
    this.platform.ready().then(()=>{
      const Branch = window['Branch'];
      Branch.initSession(data => {
        if (data['+clicked_branch_link']) {
          // read deep link data on click
          console.log('Deep Link Data: ' + JSON.stringify(data));
          this.gift = Number(data.gift);
        }
      });
    });
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
           this.auth.getAuth().currentUser.updateProfile({
            displayName: this.name,
            photoURL: ''
          });
          const Branch = window['Branch'];
          Branch.setIdentity(ss.uid).then(function (res) {
            var eventName = 'session'
            var metadata = { 'date': Date.now()  }
            Branch.userCompletedAction(eventName, metadata).then(function (res) {

            }).catch(function (err) {
            })
            console.log('Response: ' + JSON.stringify(res))
          }).catch(function (err) {
            console.log('Error: ' + err.message)
          })
          this.db.createFirstUserData(ss.uid, user.phoneNumber, this.name).then(ss=>{
            this.firebase.setUserId(this.auth.getUser().uid).then(user=>{
              console.log(user);
              loading.dismiss().then(()=>{
                
                if(this.message != undefined){
                  this.navCtrl.pop();
                }else{
                  this.navCtrl.setRoot(WherePage);
                  this.navCtrl.popToRoot();
                } 
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
        duration: 2000,
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
          duration: 2000,
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
