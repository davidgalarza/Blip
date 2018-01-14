import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { ShopFunctionsProvider } from '../../providers/shop-functions/shop-functions';
import { HttpProvider } from '../../providers/http/http';
import { TrakingPage } from '../../pages/traking/traking';


/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  tip: number = 0;
  address: any = {};
  userId: string;
  phone: string;
  addressF;
  ci: string;
  name: string;
  products: Array<any> = [];
  total: number = 0;
  totalT: number = 0;
  deliveryPrice: number = 0;
  shopId: string;
  commerce;
  tachText: boolean = false;
  credits: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider, private db: DatabaseProvider, private alertCtrl: AlertController, private shop: ShopFunctionsProvider, private loader: LoadingController, private http: HttpProvider) {
    this.products = this.navParams.get('cart');
    this.shopId = this.navParams.get('shopId');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  ionViewDidEnter() {
    this.products.forEach(product => {
      delete product['imageUrl'];
    });
    (<any>window).AccountKitPlugin.getAccount(user => {
      console.log(user);
      this.userId = user.accountId;
      this.db.getUser(user.accountId).on('value', ss => {
        this.phone = ss.val().phone;
        this.addressF = ss.val().billing.address;
        this.ci = ss.val().billing.ci;
        this.name = ss.val().billing.name;
      })

      this.storage.getByKey('activeDirection').then(key => {
        this.storage.getByKey(key).then(location => {
          console.log(location);
          this.address = location;
          this.db.getCommerById(this.shopId).on('value', (ss) => {
            console.log(ss.val());
            this.commerce = ss.val();
            this.shop.getDeliveryPrice(this.commerce, 0).then(price => {
              let priceA: any = price;
              this.deliveryPrice = priceA;
            });
            this.getBranchCredit().then(credit => {
              let credits: any = credit;
              this.credits = credits / 100;
              console.log("Creditos: ", this.credits)
              this.getTotalCart();
            this.verifyDiscount(this);
            });
            
          });

        });
      });
    });
  }
  changeTip(tip: number) {
    this.tip = tip;
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
  createOrder() {

    if (this.phone == undefined) {
      let alert = this.alertCtrl.create({
        title: 'Campo requerido',
        subTitle: 'El numero de telefono es necesario para contactarnos contigo.',
        buttons: ['Entendido']
      });
      alert.present();
    } else {
      if (this.name == '' || this.addressF == '' || this.ci == null) {
        let alert = this.alertCtrl.create({
          title: 'Campo requerido',
          subTitle: 'Los detalles de facturacion son obligatorios.',
          buttons: ['Entendido']
        });
        alert.present();
      } else {
        let loading = this.loader.create({
          content: 'Creando tu orden...'
        });
        loading.present();

        if (this.tachText) {
          const Branch = window['Branch'];
          var amount = this.deliveryPrice * 100;
          var self = this;
          if (amount != 0) {
            Branch.redeemRewards(amount).then(function (res) {
              console.log('Se debito: ' + JSON.stringify(res));
              self.http.createOrder({
                products: self.products,
                address: self.address,
                ci: self.ci,
                addressF: self.addressF,
                commerceId: self.shopId,
                details: '',
                name: self.name,
                tip: self.tip,
                uid: self.userId,
                phone: self.phone,
                delivery_price: self.deliveryPrice,
                charge: false
              }).then(res => {
                self.db.setUserBilling(self.userId, {
                  name: self.name,
                  address: self.addressF,
                  ci: self.ci
                });
                console.log(res);
                loading.dismiss();
                self.navCtrl.push(TrakingPage, {
                  id: res
                });
              });
            }).catch(function (err) {
              console.log('Error: ' + JSON.stringify(err))
            })
          } else {
            self.http.createOrder({
              products: self.products,
              address: self.address,
              ci: self.ci,
              addressF: self.addressF,
              commerceId: self.shopId,
              name: self.name,
              tip: self.tip,
              uid: self.userId,
              phone: self.phone,
              delivery_price: self.deliveryPrice,
              details: '',
              charge: false
            }).then(res => {
              self.db.setUserBilling(self.userId, {
                name: self.name,
                address: self.addressF,
                ci: self.ci
              });
              console.log(res);
              loading.dismiss();
              self.navCtrl.push(TrakingPage, {
                id: res
              });
            });
          }
        } else {
          this.http.createOrder({
            products: this.products,
            address: this.address,
            ci: this.ci,
            addressF: this.addressF,
            commerceId: this.shopId,
            name: this.name,
            uid: this.userId,
            tip: this.tip,
            phone: this.phone,
            delivery_price: this.deliveryPrice,
            details: '',
            charge: true
          }).then(res => {
            this.db.setUserBilling(this.userId, {
              name: this.name,
              address: this.addressF,
              ci: this.ci
            });
            console.log(res);
            loading.dismiss();
            this.navCtrl.push(TrakingPage, {
              id: res
            });
          });
        }

      }
    }

  }
  verifyDiscount(self) {
    if (self.credits >= self.deliveryPrice && self.total >= 20) {
      self.totalT = self.total;
      console.log("Entro");
      self.delivery_price = 0;
      self.tachText = true;
    } else {
      self.totalT = self.total + self.deliveryPrice;
      self.delivery_price = self.deliveryPrice;
      console.log("No entro");
      self.tachText = false;
    }
  }
  getBranchCredit() {
    return new Promise((resolve, reject) => {
      const Branch = window['Branch'];
      Branch.loadRewards().then(function (res) {
        resolve(res)
      }).catch(function (err) {
        reject(err);
      })
    });
  }

  promptBilling() {
    let alert = this.alertCtrl.create({
      title: 'Facturación',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nombre'
        },
        {
          name: 'ci',
          placeholder: 'CI/RUC'
        },
        {
          name: 'address',
          placeholder: 'Dirección'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Guardar',
          handler: data => {
            console.log(data)
            this.name = data.name;
            this.ci = data.ci;
            this.addressF = data.address;
          }
        }
      ]
    });
    alert.present();
  }
  promptTip() {
    let alert = this.alertCtrl.create({
      title: 'Propina',
      message: 'Agradece a los Blipers por un buen trabajo',
      inputs: [
        {
          name: 'tip',
          placeholder: 'Propina'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Guardar',
          handler: data => {
            console.log(data)
            this.tip = data.tip;
          }
        }
      ]
    });
    alert.present();
  }

}
