import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RefsTermsPage } from '../refs-terms/refs-terms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthProvider } from '../../providers/auth/auth';

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
  json: object = {
    "date": "1511564314996",
    "$og_title": "Blip",
    "custom_boolean": "true",
    "$publicly_indexable": "false", 
    "~creation_source": 2,
    "$og_description": "¡Blip es un Centro Comercial en tu bolsillo! Platos de cualquier Restaurante, Mercado, Licores o literalmente ¡Lo que quieras! Todos tus domicilios 24/7 y en minutos", 
    "custom": 
    "data", "+click_timestamp": 1511566708, "source": "android", "$identity_id": 459251096184023000, "~stage": "user", "$og_image_url": "https://firebasestorage.googleapis.com/v0/b/atiempo-5533e.appspot.com/o/icon.png?alt=media&token=c9e93480-95e0-4e06-8e75-7d33c72c57f3", "~feature": "referral", "+match_guaranteed": true, "~tags": ["one", "two", "three"], "$canonical_identifier": "content/123", "+clicked_branch_link": true, "~id": 462741154082069700, "$one_time_use": false, "~campaign": "referrals", "+is_first_session": false, "campaign": "referrals", "~channel": "facebook", "~referring_link": "https://blip.app.link/D25N3FrwlI"
  }
  rewards: number = 0;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing, private auth: AuthProvider) {
    this.platform.ready().then(()=>{
      this.initBranch();
    })
    this.initBranch();
    this.name  = this.auth.getAuth().currentUser.displayName;
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
    var bucket = 'this_bucket'
    Branch.loadRewards(bucket).then(function (res) {
      console.log('Response: ' + res)
      self.rewards = res;

    }).catch(function (err) {
      console.log('Error: ' + err)
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

  creaateReferralLink(friend: string) {
    return new Promise((resolve, reject) => {
      var analytics = {
        channel: 'facebook',
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
      this.creaateReferralLink(this.name).then(url => {
        let link: any = url;
        this.socialSharing.shareViaFacebook('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', link);
      });
    
  }
  shareViaWhatsApp() {
      this.creaateReferralLink(this.name).then(url => {
        let link: any = url;
        this.socialSharing.shareViaWhatsApp('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', link);
      });

    
  }
  shareSheet() {
      this.creaateReferralLink(this.name).then(url => {
        let link: any = url;
        this.socialSharing.share('¡Te regalo $6.00 USD para tu primer pedido en Blip! Descarga la app y pide ya', '', '', link);
      });
  }



}
