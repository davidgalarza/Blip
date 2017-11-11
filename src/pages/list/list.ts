import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Scroll } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpProvider } from '../../providers/http/http';
import { ShopPage } from '../../pages/shop/shop';
import { DatabaseProvider } from '../../providers/database/database';
import { AlgoliaProvider } from '../../providers/algolia/algolia';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
import { Content, Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
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
  @ViewChild(Content) content: Content;
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
  holders = [1, 2, 3, 4];
  showHolders = true;
  @ViewChild('myInput') myInput;  
  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider ,public db: DatabaseProvider, public geofire: GeofireProvider, public http: HttpProvider, public shopF: ShopFunctionsProvider, public algolia: AlgoliaProvider, private firebase: Firebase, public scroll: Scroll) {
    this.category = this.navParams.get('category');
    console.log(this.category);
    this.display_name = this.navParams.get('display_name');
    this.isSearch = this.navParams.get('search');
    console.log('Ctegotia Header', this.category);
    this.storage.getByKey('activeDirection').then(key =>{
      this.storage.getByKey(key).then(location=>{
        this.location = location;
        this.geofire.getNearShopIds(location.lat, location.lng).then(shopIds=>{
          console.log(shopIds);
          this.shopIds =shopIds;
          setTimeout(()=>{
            this.showHolders = false;
          },2000)
          this.shopIds.forEach(shopId => {
              this.db.getCommerById(shopId).once('value', shop=>{
                console.log(shop);
                let shopA : any = shop;
                if(shop.val() != null){
                  if(!shop.val().disabled){
                    this.geofire.distanceBetwen(shopA.val().lat, shopA.val().lng, location.lat, location.lng).then(distance=>{
                      this.shopF.createCommerceData(shopA, this.category, distance, shopId, false).then(shopData=>{
                        let shop: any = shopData
                        console.log('Shop:', shopData);
                        if(shop.name !="" && shop.commerceId !=undefined){
                          if(shop.isOpen){
                            this.openShops.unshift(shop);
                          }else{
                            this.closeShops.unshift(shop);
                          }
                        }
                      });
                    });
                  }
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
  ionViewWillEnter(){
    this.firebase.setScreenName('list');
    this.firebase.logEvent('page_view', {page: "list",
                                          category: this.category})
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));

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
      this.content.scrollToTop();

  }

  getInfoResulst(){
    this.resultIds.forEach(shopId => {
      this.db.getCommerById(shopId.objectID).on('value', shop=>{
        if(!shop.val().disabled){
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
      }
      });
    });
  }
  orderCommerces(arrayA:Array<any>){
    return arrayA.sort((a,b)=>{
      if (a.distance < b.distance)
        return -1;
      if (a.distance > b.distance)
        return 1;
      return 0;
    });
  }

}
