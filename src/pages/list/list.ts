import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpProvider } from '../../providers/http/http';
import { ShopPage } from '../../pages/shop/shop';
import { DatabaseProvider } from '../../providers/database/database';
import { AlgoliaProvider } from '../../providers/algolia/algolia';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
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
  searchText: string = '';
  category: string;
  location: any = {};
  display_name:string;
  resultShopsOpen = [];
  resultShopsClose = [];
  resultIds = [];
  openShops = [];
  closeShops = [];
  shopIds: any = [];
  isSearch: boolean = false;
  @ViewChild('myInput') myInput;  
  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider ,public db: DatabaseProvider, public geofire: GeofireProvider, public http: HttpProvider, public shopF: ShopFunctionsProvider, public algolia: AlgoliaProvider) {
    this.category = this.navParams.get('category');
    this.display_name = this.navParams.get('display_name');
    this.isSearch = this.navParams.get('search');
    console.log('Ctegotia Header', this.category);
    this.storage.getByKey('activeDirection').then(key =>{
      this.storage.getByKey(key).then(location=>{
        console.log(location);
        this.location = location;
        this.geofire.getNearShopIds(location.lat, location.lng).then(shopIds=>{
          console.log(shopIds);
          this.shopIds =shopIds;
          this.shopIds.forEach(shopId => {
            console.log(shopId);
              this.db.getCommerById(shopId).on('value', shop=>{
                let shopA : any = shop;
                if(shop.val() != null){
                  this.geofire.distanceBetwen(shopA.val().lat, shopA.val().lng, location.lat, location.lng).then(distance=>{
                    this.shopF.createCommerceData(shopA, this.category, distance, shopId, false).then(shopData=>{
                      let shop: any = shopData
                      console.log('Shop:', shopData);
                      if(shop.name !="" && shop.commerceId !=undefined){
                        if(shop.isOpen){
                          this.openShops.push(shop);
                        }else{
                          this.closeShops.push(shop);
                        }
                      }
                    });
                  });
                }
              });
            });
          });
        });
    });  
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
    if(this.isSearch){
    window.setTimeout(() => {
      this.myInput.setFocus();
      (<any>window).cordova.plugins.Keyboard.show();
    }, 600); //Autofcocos on Search 
  }
  }
  getBackground(imageUrl){
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }
  getClosedBackground(imageUrl){
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0.8), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }
  pushCommerce(id: string, isOpen: boolean, name: string){
    console.log("Id", id);
    console.log(isOpen);
    this.navCtrl.push(ShopPage, {
      shopId: id,
      isOpen: isOpen,
      name: name
    },{animate: false});
  }

  onInput(event){

      this.algolia.searchShops(this.searchText, this.location.lat, this.location.lng).then((results)=>{
        this.resultShopsOpen = [];
        this.resultShopsClose = [];
        console.log(results);
        this.resultIds = results.hits;
        console.log('Results', results);
        this.getInfoResulst();
      });
      

  }

  getInfoResulst(){
    this.resultIds.forEach(shopId => {
      this.db.getCommerById(shopId.objectID).on('value', shop=>{
        let shopA : any = shop;
        console.log("ShopV", shopA.val())
        this.geofire.distanceBetwen(shopA.val().lat, shopA.val().lng, this.location.lat, this.location.lng).then(distance=>{
          console.log("Ditance", distance);
          this.shopF.createCommerceData(shopA, this.category, distance, shop.key, this.isSearch).then(shopData=>{
            let shop: any = shopData
            console.log("Shop", shop);
            if(shop.name !="" && shop.commerceId !=undefined){
              if(shop.isOpen){
                this.resultShopsOpen.push(shop);
              }else{
                this.resultShopsClose.push(shop);
              }
            }
          });
        });
      });
    });
  }

}
