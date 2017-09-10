import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { HttpProvider } from '../../providers/http/http';
import { StorageProvider } from '../../providers/storage/storage';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
import { TrakingPage } from '../../pages/traking/traking';
/**
 * Generated class for the CartPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  products: Array<any> = [];
  shopId: any;
  commerce: any = {};
  d: string;
  total:number = 0;
  totalT: number = 0;
  dis: any;
  address: any = {};
  deliveryPrice: number = 0;
  details: string = "";
  ci: number = null;
  phone: string = '';
  addressF: string = '';
  name: string = '';
  personalized: boolean;
  text: string;
  disabled: boolean = false;
  userId;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider, public geofire: GeofireProvider, public storage: StorageProvider, public shop: ShopFunctionsProvider, public alertCtrl: AlertController, public http: HttpProvider, public loader: LoadingController) {
    this.products = this.navParams.get('cart');
    console.log(this.products);
    this.shopId = this.navParams.get('commerce');
    this.personalized = this.navParams.get('personalized');
    (<any>window).AccountKitPlugin.getAccount(user=>{
      console.log(user);
      this.userId = user.accountId;
      this.db.getUser(user.accountId).on('value', ss=>{
        console.log("Usuario:", ss.val());
        this.phone = ss.val().phone;
        this.addressF = ss.val().billing.address;
        this.ci = ss.val().billing.ci;
        this.name = ss.val().billing.name;
      })
    });
    
    this.storage.getByKey('activeDirection').then(key=>{
      this.storage.getByKey(key).then(location=>{
        console.log(location);
        this.address = location;
        if(!this.personalized){
          this.getTotalCart();
          //this.dis = this.distance(this.commerce.lat, this.commerce.lng, this.adress.lat,this.adress.lng);
          this.db.getCommerById(this.shopId).on('value', (ss)=>{
            console.log(ss.val());
            this.commerce = ss.val();
            this.dis = this.geofire.distanceBetwen(location.lat, location.lng, ss.val().lat, ss.val().lng ).then(dis=>{
              this.shop.getDeliveryPrice(dis).then(price=>{
                let priceA: any = price;
                this.deliveryPrice = priceA;
                this.updateTotalT();
              });
            });
          });
          this.totalT = this.total + this.deliveryPrice;
        }else{
          this.text = this.navParams.get('text'); 
          this.details = this.text;
          this.totalT = 2;
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  increaseCart(productKey: string){
    console.log(productKey);
    let finded = false;
    let index;
    for(var i = 0; i < this.products.length; i++){
      if (this.products[i].product == productKey) {
        finded = true;
        index = i;
        break;
      }
    }
    if(finded){
      this.products[index].cant +=1;
      this.getTotalCart();
      this.updateTotalT();
    }
  }
  decreaseCart(productKey: string){
        let finded = false;
    let index;
    for(var i = 0; i < this.products.length; i++){
      if (this.products[i].product == productKey) {
        finded = true;
        index = i;
        break;
      }
    }
    if(finded){
      this.products[index].cant -=1;
      this.getTotalCart();
      this.updateTotalT();
      if(this.products[index].cant == 0){
        this.products.splice(i,1);
        this.getTotalCart();
        this.updateTotalT();
      }
    }
  }
  getTotalCart(){
    this.total =0;
    this.products.forEach(product=>{
      this.total += product.price * product.cant;
    });
  }
  updateTotalT(){
    this.totalT = this.total + this.deliveryPrice;
  }
  createOrder(){
    
    if(this.phone == undefined ){
      let alert = this.alertCtrl.create({
        title: 'Campo requerido',
        subTitle: 'El numero de telefono es necesario para contactarnos contigo.',
        buttons: ['Entendido']
      });
      alert.present();
    }else{
      if(this.name == '' || this.addressF =='' || this.ci == null ){
        let alert = this.alertCtrl.create({
          title: 'Campo requerido',
          subTitle: 'Los detalles de facturacion son obligatorios.',
          buttons: ['Entendido']
        });
      alert.present();
      }else{
        let loading = this.loader.create({
          content:'Creando tu orden...'
        });
        loading.present();
        if(!this.personalized){
          this.http.createOrder({
            products: this.products,
            address: this.address,
            details: this.details,
            ci: this.ci,
            addressF: this.addressF,
            commerceId: this.shopId,
            name: this.name,
            uid: this.userId,
            phone: this.phone
          }).then(res=>{
            this.db.setUserBilling(this.userId, {
              name: this.name,
              address: this.addressF,
              ci: this.ci
            });
            console.log(res);
            loading.dismiss();
            this.navCtrl.push(TrakingPage,{
              id: res
            });
          })
        }else{
          console.log(this.userId);
          this.http.createOrder({
            address: this.address,
            details: this.details,
            ci: this.ci,
            adressF: this.addressF,
            name: this.name,
            uid: this.userId,
            phone: this.phone,
            type: 'personalized'
          }).then(res=>{
            this.db.setUserBilling(this.userId, {
              name: this.name,
              address: this.addressF,
              ci: this.ci
            });
            let orderId:any = res;
            console.log(res);
            loading.dismiss();
            this.navCtrl.push(TrakingPage,{
              id: res
            });
          });
        }
      }
      }
  }
  /*
  pushLocationPage(){
    this.navCtrl.push(LocationsPage);
  }*/
}
