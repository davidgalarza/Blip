import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { NativeAudio } from '@ionic-native/native-audio';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';

import { CheckoutPage } from '../../pages/checkout/checkout';
/**
 * Generated class for the CartmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cartm',
  templateUrl: 'cartm.html',
})
export class CartmPage {
  products: Array<any> = [];
  shopId: any;
  commerce: any = {};
  address: any = {};
  total: number = 0;
  totalT: number = 0;
  deliveryPrice: number = 0;
  mapLink: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private db: DatabaseProvider, private nativeAudio: NativeAudio, private shop: ShopFunctionsProvider) {
    //this.products = this.navParams.get('cart');
    this.shopId = this.navParams.get('commerce');

    

    this.storage.getByKey('activeDirection').then(key => {
      this.storage.getByKey(key).then(location => {
        console.log(location);
        this.address = location;
        this.mapLink = 'https://maps.googleapis.com/maps/api/staticmap?center='+this.address.lat+','+this.address.lng+'&zoom=17&size=500x500&style=feature:road|color:0xffffff|visibility:simplified&&markers=color:blue%7Clabel:S%7C'+this.address.lat+','+this.address.lng+'&key=AIzaSyCoRb8eDf4KnwNHuL1LIMK_o1LQqxzuf3Y';
        
          this.db.getCommerById(this.shopId).on('value', (ss) => {
            console.log(ss.val());
            this.commerce = ss.val();
            this.shop.getDeliveryPrice(this.commerce, 0).then(price => {
              let priceA: any = price;
              this.deliveryPrice = priceA;
            });
            this.getTotalCart();
            
          });



        
      });
    });
    this.nativeAudio.preloadSimple('up', 'assets/sounds/up_general.mp3').then((dat)=>{
      console.log('Cargo: ', dat)
    }, (err)=>{
      console.log("Error", err)
    });
    this.nativeAudio.preloadSimple('down', 'assets/sounds/down_general.mp3').then((dat)=>{
      console.log('Cargo: ', dat)
    }, (err)=>{
      console.log("Error", err)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartmPage');
    this.products = [];
    this.navParams.get('cart').forEach(product => {
      let pro: any = product;
      console.log("product: ", pro);
      this.db.getProduct(pro.product).subscribe(ss=>{
        pro.imageUrl = ss.imageUrl
        console.log("Product: ", pro)
        this.products.push(pro);
      })
      
    });
  }

  increaseCart(productKey: string) {
    console.log(productKey);
    let finded = false;
    let index;
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].product == productKey) {
        finded = true;
        index = i;
        break;
      }
    }
    if (finded) {
      this.products[index].cant += 1;
      this.getTotalCart();
      //this.updateTotalT();
      this.nativeAudio.play('up').then(dat=>{
        console.log('Sono: ', dat)
        
      }, err=>{
       console.log( "Error play: ", err)
      });
    }
  }
  decreaseCart(productKey: string) {
    let finded = false;
    let index;
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].product == productKey) {
        finded = true;
        index = i;
        break;
      }
    }
    if (finded) {
      this.products[index].cant -= 1;
      this.getTotalCart();

      //this.updateTotalT();
      if (this.products[index].cant == 0) {
        this.products.splice(i, 1);
        this.getTotalCart();
        //this.updateTotalT();
      }
      this.nativeAudio.play('down').then(dat=>{
        console.log('Sono: ', dat)
        
      }, err=>{
       console.log( "Error play: ", err)
      });
    }
  }
  getTotalCart() {
    this.total = 0;
    this.products.forEach(product => {
      this.total += product.price * product.cant;
    });
  }
  updateTotalT() {
    this.totalT = this.total + this.deliveryPrice;
  }
  
  getProductImage(id){
    console.log(id);
    this.db.getProduct(id).subscribe(ss=>{
      console.log(ss.imageUrl);
      return ss.imageUrl;
    })
  }
  pushCheckout(){
    this.navCtrl.push(CheckoutPage, {
      cart: this.products,
      shopId: this.shopId
    })
  }

}
