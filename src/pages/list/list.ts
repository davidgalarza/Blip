import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpProvider } from '../../providers/http/http';

/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  category: string;
  location: any = {};
  display_name:string;
  openShops = [];
  closeShops = [];
  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public http: HttpProvider) {
    this.category = this.navParams.get('category');
    this.display_name = this.navParams.get('display_name')
    this.storage.getByKey('activeDirection').then(key =>{
      this.storage.getByKey(key).then(location=>{
        console.log(location);
        this.location = location;
        this.http.getShops(this.location.lat, this.location.lng, this.category).then((shops)=>{
          console.log(shops);
          console.log(typeof shops);
          let shopsList =  eval(shops.toString());
          for(let shop of shopsList){
            if(shop.isOpen){
              this.openShops.push(shop);
            }else{
              this.closeShops.push(shop);
            }
          }
        });
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }
  getBackground(imageUrl){
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }
  getClosedBackground(imageUrl){
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0.8), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }

}
