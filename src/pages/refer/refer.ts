import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RefsTermsPage } from '../refs-terms/refs-terms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthProvider } from '../../providers/auth/auth';
import { DatabaseProvider } from '../../providers/database/database';
import { transition } from '@angular/core/src/animation/dsl';

/**
 * Generated class for the ReferPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-refer',
  templateUrl: 'refer.html',
})

export class ReferPage {
  name: string;
  json: Array<any> = [
    {
      "transaction":
        {
          "date": "2017-11-24T23:12:36.462Z",
          "id": "462744683257453610", "bucket": "default", "type": 0, "amount": 5
        },
      "event":
        {
          "name": "install",
          "metadata":
            {
              "reinstall": false,
              "ip": "190.152.130.171",
              "referred": true
            }
        },
      "referrer": "502323476775506", "referree": null
    }]
  transactioHistory: Array<object> = [];
  rewards: number = 0;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing, private auth: AuthProvider, private db: DatabaseProvider) {
    this.platform.ready().then(() => {
      this.initBranch();
    })
    this.initBranch();
    this.name = this.auth.getAuth().currentUser.displayName;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReferPage');

  }
  pushTerms() {
    this.navCtrl.push(RefsTermsPage);
  }
  initBranch() {
    var self = this;
    if (!this.platform.is('cordova')) { return }
    const Branch = window['Branch'];
    Branch.creditHistory().then(function (res) {
      return new Promise((resolve, reject)=>{
        self.transactioHistory = [];
        for(let i = 0; i<res.length; i++){
          console.log(res[i].referree)
          if(res[i].referree != null){
            self.db.getUser(res[i].referree).once('value', (ss)=>{
              if(ss.val() != null){
                self.transactioHistory.push({
                  name: ss.val().name,
                  amount: (res[i].transaction.amount)/100
                });
                self.updateRewards();
              }
              console.log(self.transactioHistory);
            })
          }
          if(i == (res.length-1)){
            console.log("se resuleva")
            resolve()
          }
        }
      });
      
    }).catch(function (err) {
      console.log('Error: ' + JSON.stringify(err))
    })
  }

  createUniversalObject(friend: string) {

    return new Promise((resolve, reject) => {
      var properties = {
        canonicalIdentifier: 'content/123',
        title: 'Blip',
        contentDescription: "¡Blip es un Centro Comercial en tu bolsillo! Platos de cualquier Restaurante, Mercado, Licores o literalmente ¡Lo que quieras! Todos tus domicilios 24/7 y en minutos",
        contentImageUrl: 'https://firebasestorage.googleapis.com/v0/b/atiempo-5533e.appspot.com/o/icon.png?alt=media&token=c9e93480-95e0-4e06-8e75-7d33c72c57f3',
        contentIndexingMode: 'private',
        contentMetadata: {
          friend: friend,
          gift: 6
        }
      }
      const Branch = window['Branch'];
      // create a branchUniversalObj variable to reference with other Branch methods
      var branchUniversalObj = null
      Branch.createBranchUniversalObject(properties).then(function (res) {
        branchUniversalObj = res
        resolve(branchUniversalObj);
      }).catch(function (err) {
        reject(err)
      })
    });
  }

  creaateReferralLink(friend: string, channel: string) {
    return new Promise((resolve, reject) => {
      var analytics = {
        channel: channel,
        feature: 'referral',
        campaign: 'referrals',
        stage: 'user',
        tags: ['one', 'two', 'three']
      }
      var message = '¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya';
      var properties = {
        campaign: 'referrals',
        date: Date.now(),
        custom_boolean: true,
      }
      this.createUniversalObject(friend).then(obj => {
        let branchUniversalObj: any = obj;
        branchUniversalObj.generateShortUrl(analytics, properties).then(function (res) {
          console.log('Response: ' + JSON.stringify(res.url))
          // share sheet
          resolve(res.url);

          //branchUniversalObj.showShareSheet(analytics, properties, message)
        }).catch(function (err) {
          alert('Error: ' + JSON.stringify(err))
          reject(err);
        })
      }).catch(error => {
        reject(error);
      })
    })
  }

  shareViaFacebook() {
    this.creaateReferralLink(this.name, 'facebook').then(url => {
      let link: any = url;
      this.socialSharing.shareViaFacebook('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', link);
    });

  }
  shareViaWhatsApp() {
    this.creaateReferralLink(this.name, 'whatsapp').then(url => {
      let link: any = url;
      this.socialSharing.shareViaWhatsApp('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', link);
    });


  }
  shareSheet() {
    this.creaateReferralLink(this.name, 'other').then(url => {
      let link: any = url;
      this.socialSharing.share('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', '', link);
    });
  }

  getUserNameById(uid: string){
    console.log(uid);
    this.db.getUser(uid).on('value', (ss)=>{
      return ss.val().name;
    })
  }
  updateRewards(){
    this.rewards = 0;
    this.transactioHistory.forEach(element => {
      let transaction: any = element;
      this.rewards += transaction.amount;
    });
  }



}
