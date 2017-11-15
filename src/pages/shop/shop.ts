import { Component, ViewChild,  NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Content, Platform, Searchbar } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
import { AlgoliaProvider } from '../../providers/algolia/algolia';
import { StorageProvider } from '../../providers/storage/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { OptsPage } from '../opts/opts';
import { CartPage } from '../cart/cart';
import { Firebase } from '@ionic-native/firebase';
import { WelcomePage } from '../../pages/welcome/welcome';
import * as moment from 'moment-timezone';
import { Keyboard } from '@ionic-native/keyboard';

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
//Hola
export class ShopPage {
  @ViewChild(Content) content: Content;
  @ViewChild('searchBar') searchInput: Searchbar;
  zone: NgZone;
  shop: any = {};
  results: Array<any> = [];
  menus = [];
  products: Array<any> = [];
  menu;
  cart: Array<any> = [];
  cartLenght: number = 0;
  total = 0;
  empty = true;
  shopId: string;
  isOpen: any;
  shopName: string;
  text: string = '';
  distance: number = 0;
  price: number = 0;
  prueba = [{ $key: "-Ko912LubYCtwp4sVF29", commerceId: "HXNrxb1G1fYjx0dh6nQAoPzpEkg2", description: "Chaulafán especial, Chancho con tamarindo, Tallarín especial.", imageUrl: "https://firebasestorage.googleapis.com/v0/b/atiempo-5533e.appspot.com/o/uploads%2FHXNrxb1G1fYjx0dh6nQAoPzpEkg2%2Fproducts%2FEspecial%20(1).jpg?alt=media&token=e3a9d22d-32ec-4a02-896d-7515cdb07f32", menu: "platos especiales - special dishes", price: 8.4, product: "Bandeja Especial #1" }]
  holders = [1, 2, 3, 4, 5, 6];
  showHolders = true;
  showSearchBar: boolean = false;
  public scrollAmount = 0;
  constructor(private _sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider, public modalCtrl: ModalController, public alert: AlertController, public algolia: AlgoliaProvider, public shopF: ShopFunctionsProvider, public storage: StorageProvider, public platform: Platform, private firebase: Firebase, public toastCtrl: ToastController, public auth: AuthProvider, private keyboard: Keyboard) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    //this.shopId = this.navParams.get('shopId');
    this.shopId = 'HXNrxb1G1fYjx0dh6nQAoPzpEkg2';
    //this.isOpen = this.navParams.get('isOpen');
    
    this.shopName = this.navParams.get('name');
    console.log(this.navParams.get('name'));
    console.log(this.shopId);
    this.db.getCommerById(this.shopId).on('value', ss => {
      console.log(ss.val())
      this.shop = ss.val();
      this.shopF.isOpen(this.shop).then(open=>{
        this.isOpen = open;
      })
      this.shopName = ss.val().name;
      this.storage.getByKey('activeDirection').then(key => {
        this.storage.getByKey(key).then(location => {
          this.shopF.geofire.distanceBetwen(this.shop.lat, this.shop.lng, location.lat, location.lng).then(dis => {
            let distance: any = dis
            this.distance = distance;
            this.shopF.getDeliveryPrice(this.distance).then(pri => {
              let price: any = pri;
              this.price = price;
            });
          });
        });
      });

      this.db.getProducts(this.shopId).subscribe(snap => {
        this.products = snap;
        console.log("Productos", snap);
        this.db.getCommerceMenus(this.shopId).subscribe(menus => {
          this.showHolders = false;
          this.menus = menus;
          console.log("Menus", menus);
        });
      });

    });

  }


  ngOnInit() {
  }
  ngAfterViewInit() {
    document.getElementById('header').style.height = '130px';
    document.getElementById('contentC').style.marginTop = '130px';
    document.getElementById('text1').style.marginLeft = '0px';
    document.getElementById('text2').style.marginRight = '0px';
    this.content.resize();
    this.content.ionScroll.subscribe(($e) => {
      if($e.scrollTop <= 74 ){
        document.getElementById('header').style.height = (130 - $e.scrollTop).toString() + 'px';
        document.getElementById('contentC').style.marginTop = document.getElementById('header').style.height;
        document.getElementById('firstC').style.display = '-webkit-box';
        document.getElementById('text1').style.marginLeft = (-(($e.scrollTop)/74)*430).toString() + 'px';
        document.getElementById('text2').style.marginRight = (-(($e.scrollTop)/74)*430).toString() + 'px';
      }else{
        document.getElementById('header').style.height = '56px';
        document.getElementById('contentC').style.marginTop = document.getElementById('header').style.height;
        document.getElementById('text1').style.marginLeft = '-900px';
        document.getElementById('text2').style.marginRight = '-900px';
        document.getElementById('firstC').style.display = 'none';
      }
    
      
      this.zone.run(() => {
        console.log($e);
        this.scrollAmount++;
        //document.getElementById('header').style.height = 
        //document.getElementById('page-header').style.opacity = (1 - $e.scrollTop / 120).toString();
        //document.getElementById('header-bg').style.backgroundSize = (100 + $e.scrollTop).toString() + '%';
       // document.getElementById('main-header').style.background = "rgba(238,91,95," + ($e.scrollTop / 120) + ")";
       // console.log("If");

      });

    });
    this.content.ionScroll.subscribe(($e) => {
      this.zone.run(() => {
        console.log($e);
        this.scrollAmount++
        if ($e.scrollTop <= 130) {
          //document.getElementById('page-header').style.opacity = (1 - $e.scrollTop / 120).toString();
          //document.getElementById('header-bg').style.backgroundSize = (100 + $e.scrollTop).toString() + '%';
          //document.getElementById('main-header').style.background = "rgba(238,91,95," + ($e.scrollTop / 120) + ")";
//console.log("If");

        }
      });
    });
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad:', this.products);
  }
  ionViewWillEnter() {
    this.firebase.setScreenName('shop');
    this.firebase.logEvent('page_view', { page: "shop" })
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));

  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter', this.products)
  }
  getBackground(imageUrl) {
    return this._sanitizer.bypassSecurityTrustStyle(`radial-gradient( rgba(29, 29, 29, 0.8), rgba(16, 16, 23, 0.8)), url(${imageUrl})`);
  }
  segmentChanged(event) {
    console.log('click');
    console.log(this.menu);
    let yOffset = document.getElementById(this.menu).offsetTop;
    console.log(yOffset);
    this.content.scrollTo(0, yOffset, 1000);
  }
  changeMenus(i) {
    let yOffset = document.getElementById(i).offsetTop;
    console.log(yOffset);
    this.content.scrollTo(0, yOffset, 1000);
  }
  filterByMenu(menu, products) {
    let productsOfMenu = products.filter(product => {
      return product.menu == menu;
    });
    return productsOfMenu;
  }

  isInCart(productKey: string) {
    let isInCart = false;
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].product == productKey) {
        isInCart = true;
        break;
      }
    }
    return isInCart;
  }
  getCount(productKey: string) {
    let count = 0;
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].product == productKey) {
        count = this.cart[i].cant;
        break;
      }
    }
    return count;
  }

  addToCart(productKey: string) {
    
    if (this.isOpen) {
      this.verifyAuth();
      this.isEmpty();
      console.log(productKey);
      let finded;
      let index;
      let product;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].product == productKey) {
          finded = true;
          index = i;
          break;
        }
      }
      if (finded) {
        this.cart[index].cant += 1;
        this.getTotalCart();
      } else {
        let extraPrice = 0;
        product = this.products.filter(product => {
          return product.$key == productKey;
        });
        console.log(product);
        if (product[0].hasOwnProperty("options")) {

          let modal = this.modalCtrl.create(OptsPage, {
            options: product[0].options,
            name: product[0].product,
            description: product[0].description
          });
          modal.onDidDismiss(data => {
            if (data != null) {
              data.forEach(extra => {
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
        } else {
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
    } else {
      const toast1 = this.toastCtrl.create({
        message: this.shopName + ' esta cerrado',
        duration: 3000,
        position: 'top',
        cssClass: "infoWin"
      });

      toast1.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast1.present();
    }
  }
  removeToCart(productKey: string) {
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].product == productKey) {
        this.cart[i].cant -= 1;

        if (this.cart[i].cant == 0) {
          this.cart.splice(i, 1);
        }
        break;
      }
    }
    this.getTotalCart();
    this.isEmpty();
  }
  getTotalCart() {
    this.total = 0;
    this.cart.forEach(product => {
      this.total += product.price * product.cant;
    });
  }
  presentOptionsModal() {
    let optionsModal = this.modalCtrl.create(ShopPage, { userId: 8675309 });
    optionsModal.present();
  }
  isEmpty() {
    if (this.cart.length > 0) {
      this.empty = false;
    } else {
      this.empty = true;
    }
  }

  carT() {
    this.navCtrl.push(CartPage, { cart: this.cart, commerce: this.shopId, personalized: false });
  }
  onInput(event) {
    this.content.scrollTo(0, 216);
    this.algolia.serchProducts(this.text, this.shopId).then(ss => {
      this.results = ss.hits;
    })
  }
  myHeaderFn(record, recordIndex, records) {
    console.log(recordIndex);

    if (recordIndex == 0) {
      return records[recordIndex].menu;
    } else {
      if (records[recordIndex].menu != records[recordIndex - 1].menu) {
        return records[recordIndex].menu
      }
      return null;
    }
  }
  verifyAuth(){
    this.auth.getAuth().onAuthStateChanged(user=>{
      if(!user){
        this.navCtrl.push(WelcomePage,{
          message: "Primero debes iniciar sesión",
        });
      }
    });
  }
  updateCant(){
    this.cartLenght = 0;
    this.cart.forEach(product=>{
      this.cartLenght += product.cant;
    })
  }
  toogleSearch(){
    this.content.scrollToTop().then(()=>{
      this.showSearchBar = !this.showSearchBar;
      if(this.showSearchBar){
        setTimeout(() => {
          this.searchInput.setFocus();
          this.keyboard.show();
        }, 300);
      }else{
        setTimeout(() => {
          this.keyboard.close();
        }, 300);
      }
      
    })
  }

  
}
