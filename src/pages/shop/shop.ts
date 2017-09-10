import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Content } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
import { AlgoliaProvider } from '../../providers/algolia/algolia';
import { OptsPage } from '../opts/opts';
import { CartPage } from '../cart/cart';
/**
 * Generated class for the ShopPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})

export class ShopPage {
  @ViewChild(Content) content: Content;
  shop;
  results:Array<any> = []; 
  menus = [];
  products:Array<any> = [];
  menu;
  cart: Array<any> = [];
  total = 0;
  empty = true;
  shopId: string;
  isOpen: boolean;
  shopName: string;
  text:string = '';
  prueba = [ {$key: "-Ko912LubYCtwp4sVF29",commerceId: "HXNrxb1G1fYjx0dh6nQAoPzpEkg2",description: "Chaulafán especial, Chancho con tamarindo, Tallarín especial.",imageUrl: "https://firebasestorage.googleapis.com/v0/b/atiempo-5533e.appspot.com/o/uploads%2FHXNrxb1G1fYjx0dh6nQAoPzpEkg2%2Fproducts%2FEspecial%20(1).jpg?alt=media&token=e3a9d22d-32ec-4a02-896d-7515cdb07f32",menu: "platos especiales - special dishes",price: 8.4,product: "Bandeja Especial #1"}]

  constructor(private _sanitizer: DomSanitizer,public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider, public modalCtrl: ModalController, public alert:AlertController, public algolia:AlgoliaProvider, public shopF: ShopFunctionsProvider) {
    this.shopId = this.navParams.get('shopId');
    this.isOpen = this.navParams.get('isOpen');
    this.shopName = this.navParams.get('name');
    console.log(this.navParams.get('name'));
    console.log(this.shopId);
    this.db.getCommerById(this.shopId).on('value',ss=>{
      console.log(ss)
      this.shop = ss.val();
      this.shopName = ss.val().name;
    });
    this.db.getProducts(this.shopId).subscribe(snap=>{
      this.products = snap;
      console.log("Productos", snap);
      this.db.getCommerceMenus(this.shopId).subscribe(menus=>{
        this.menus = menus;
        console.log("Menus", menus);
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad:', this.products);
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter', this.products)
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter', this.products)
  }
  getBackground(imageUrl){
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0.8), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }
  segmentChanged(event){
    console.log('click');
    console.log(this.menu);
    let yOffset = document.getElementById(this.menu).offsetTop;
    console.log(yOffset);
    this.content.scrollTo(0, yOffset,1000);
  }
  changeMenus(i){
    let yOffset = document.getElementById(i).offsetTop;
    console.log(yOffset);
    this.content.scrollTo(0, yOffset,1000);
  }
  filterByMenu(menu, products) {
    let productsOfMenu = products.filter(product=>{
      return product.menu == menu;
    });
    return productsOfMenu;
  }

  isInCart(productKey: string){
    let isInCart = false;
    for(var i = 0; i < this.cart.length; i++){
      if (this.cart[i].product == productKey) {
        isInCart = true;
        break;
      }
    }
    return isInCart;
  }
  getCount(productKey: string){
    let count = 0;
    for(var i = 0; i < this.cart.length; i++){
      if (this.cart[i].product == productKey) {
        count = this.cart[i].cant;
        break;
      }
    }
    return count;
  }
  
  addToCart(productKey: string){
    console.log(this.isOpen);
    if(this.isOpen){
      this.isEmpty();
      console.log(productKey);
      let finded;
      let index;
      let product;
      for(var i = 0; i < this.cart.length; i++){
        if (this.cart[i].product == productKey) {
          finded = true;
          index = i;
          break;
        }
      }
      if(finded){
        this.cart[index].cant +=1;
        this.getTotalCart();
      }else{
        let extraPrice = 0;
        product = this.products.filter(product=>{
          return product.$key == productKey;
        });
        console.log(product);
        if(product[0].hasOwnProperty("options")){

          let modal = this.modalCtrl.create(OptsPage, {
            options: product[0].options,
            name: product[0].product,
            description: product[0].description
          });
          modal.onDidDismiss(data => {
            if(data != null){
              data.forEach(extra=>{
                extraPrice += extra.price;
                console.log(extraPrice);
              });
              this.cart.push({
                product: productKey,
                cant: 1,
                price: product[0].price + extraPrice,
                name: product[0].product,
                options: data
              });
              console.log(this.cart);
              this.getTotalCart();
              this.isEmpty();
            }
          });
          modal.present();
        }else{
          this.cart.push({
            product: productKey,
            cant: 1,
            name: product[0].product,
            price: product[0].price
          });
          this.getTotalCart();
        }
      }
      this.isEmpty();
    }else{
      let alert = this.alert.create({
        title: this.shopName + ' esta cerrado',
        subTitle: 'Puedes intentarlo en otro momento.',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  removeToCart(productKey: string){
    
    for(var i = 0; i < this.cart.length; i++){
      if (this.cart[i].product == productKey) {
        this.cart[i].cant -= 1;
        
        if(this.cart[i].cant == 0){
          this.cart.splice(i,1);
        }
      break;
      }
    }
    this.getTotalCart();
    this.isEmpty();
  }
  getTotalCart(){
    this.total =0;
    this.cart.forEach(product=>{
      this.total += product.price * product.cant;
    });
  }
  presentOptionsModal() {
   let optionsModal = this.modalCtrl.create(ShopPage, { userId: 8675309 });
   optionsModal.present();
  }
  isEmpty(){
    if(this.cart.length > 0){
      this.empty = false;
    }else{
      this.empty = true;
    }
  }
  
  carT(){
    this.navCtrl.push(CartPage, {cart: this.cart, commerce: this.shopId, personalized: false});
  }
  onInput(event){
    this.algolia.serchProducts(this.text,this.shopId).then(ss=>{
      this.results = ss.hits;
    })
  }
}
