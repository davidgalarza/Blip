import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RefsTermsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-refs-terms',
  templateUrl: 'refs-terms.html',
})
export class RefsTermsPage {
  name: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,  private socialSharing: SocialSharing, private auth: AuthProvider) {
    this.name = this.auth.getAuth().currentUser.displayName;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RefsTermsPage');
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

}
