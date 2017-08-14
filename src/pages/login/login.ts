import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  phoneNumber:number;
  verificationId;
  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, private auth: AuthProvider) {
  }

  ionViewDidLoad() {

   console.log('ionViewDidLoad LoginPage');
     var that= this;
     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': function(response) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
   
  }
  });  
  }
/*
  signIn(phoneNumber: number){

    
    console.log('Que mas');
    console.log('jol')
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+593" + phoneNumber.toLocaleString();
    console.log(phoneNumberString);
    this.auth.siginWithPhone(phoneNumberString, appVerifier) .then( confirmationResult => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
       let prompt = this.alertCtrl.create({
        title: 'Ingresa el codigo de Verificacion',
        inputs: [{ name: 'confirmationCode', placeholder: 'Codigo' }],
        buttons: [
          { text: 'Cancelar',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Enviar',
            handler: data => {
                  confirmationResult.confirm(data.confirmationCode)
        .then(function (result) {
          // User signed in successfully.
          console.log('Esta aqui');
          this.navCtrl.pop(HomePage);
          
        }).catch(function (error) {
          // User couldn't sign in (bad verification code?)
          // ...
        });
        }
      }
    ]
    });
    prompt.present();
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  }*/
  button(){
  
  }
}
