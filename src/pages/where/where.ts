/**
 * Page to select the delivery direction.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController, AlertController, ActionSheetController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AddDirectionPage } from '../../pages/add-direction/add-direction';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { HomePage } from '../../pages/home/home';
import { OrdersPage } from '../../pages/orders/orders';
import { AddrefPage } from '../../pages/addref/addref';
import { LatLng, Geocoder } from '@ionic-native/google-maps';

import { LocationAccuracy } from '@ionic-native/location-accuracy';




@IonicPage()
@Component({
  selector: 'page-where',
  templateUrl: 'where.html',
})
export class WherePage {
  locations: Array<any> = [];
  hasActiveOrders: boolean = false;
  userName: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public geolocation: Geolocation, public geocoder: Geocoder, public db: DatabaseProvider, public auth: AuthProvider, public loader: LoadingController, public menu: MenuController, private locationAccuracy: LocationAccuracy, private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController) {
    this.menu.enable(false);
    this.auth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        this.db.getUser(user.uid).on('value', (ss) => {
          this.userName = ss.val().name;
        })
        this.db.getMyOrders(this.auth.getUser().uid).subscribe((orders) => {
          orders.forEach(order => {
            if (order.status != 'rated') {
              this.hasActiveOrders = true;
            }
          });
        });
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WherePage');
    this.storage.getLocationsKeys().then((keys) => {
      console.log(keys)
      keys.forEach((key) => {
        if (key != "activeDirection") {
          this.storage.getByKey(key).then((location) => {
            location.key = key;
            this.locations.push(location);
          });
        }
      });
    })
  }

  pushAddDirectionPage() {
    this.navCtrl.push(AddDirectionPage)
  }
  setCurrentLocation() {
    let loader = this.loader.create({
      content: 'Ubicandote...'
    })
    loader.present();

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.geolocation.getCurrentPosition().then((position) => {
              this.db.setPath('/prueba/actual', position);
              let myPosition: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
              this.geocoder.geocode({ position: myPosition }).then((result) => {
                console.log("Resultado", result);
                /* Android
                this.storage.saveDirection(result[0].extra.featureName,result[0].position.lat,result[0].position.lng, '');
                this.setLocation(result[0].extra.featureName);*/
                /* IOS
                this.storage.saveDirection(result[0].extra.lines[0],result[0].position.lat,result[0].position.lng, '');
                this.setLocation(result[0].extra.lines[0]);*/
                /*this.promptReference().then((data) => {
                  if (data != {}) {
                    let ref: any = data;
                    console.log(ref);
                    this.storage.saveDirection(result[0].extra.featureName, result[0].position.lat, result[0].position.lng, ref.refenece);
                    this.setLocation(result[0].extra.featureName);
                    loader.dismiss();
                  }else{
                    loader.dismiss();
                  }
                })*/
                loader.dismiss();
                this.navCtrl.push(AddrefPage, {
                  featureName: result[0].extra.featureName,
                  lat: result[0].position.lat,
                  lng: result[0].position.lng
                })

              });
            });
          },
          error => console.log('Error requesting location permissions', error)
        );
      }

    });


  }
  setLocation(key) {
    this.storage.setActiveLocation(key).then(() => {
      this.storage.getByKey('activeDirection').then((value) => {
        console.log(value);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      });
    });
  }
  pushOrdersPage() {
    this.navCtrl.push(OrdersPage);
  }

  promptReference() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Referencia',
        message: 'Piso/Oficina/Departamento/Lugar referencial',
        inputs: [
          {
            name: 'refenece',
            placeholder: 'Referencia'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: data => {
              resolve({})
            }
          },
          {
            text: 'Continuar',
            handler: data => {
              resolve(data)
            }
          }
        ]
      });
      alert.present();
    })
  }

  showActionSheet(key) {
    let actionSheet = this.actionSheetCtrl.create({
      title: key,
      buttons: [
        {
          text: 'Pedir a esta dirección',
          role: 'destructive',
          icon: 'md-heart',
          handler: () => {
            console.log('Destructive clicked');

            this.setLocation(key);
          }
        }, {
          text: 'Eliminar',
          icon: 'md-trash',
          handler: () => {
            console.log('Archive clicked');
            this.storage.delete(key).then(()=>{
              this.locations = [];
              this.storage.getLocationsKeys().then((keys) => {
                console.log(keys)
                keys.forEach((key) => {
                  if (key != "activeDirection") {
                    this.storage.getByKey(key).then((location) => {
                      location.key = key;
                      this.locations.push(location);
                    });
                  }
                });
              })
            })
          }
        }, {
          text: 'Cancelar',
          icon: 'md-close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
