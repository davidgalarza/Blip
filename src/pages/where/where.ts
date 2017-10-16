/**
 * Page to select the delivery direction.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { AddDirectionPage } from '../../pages/add-direction/add-direction';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { HomePage } from '../../pages/home/home';
import { OrdersPage } from '../../pages/orders/orders';
import { LatLng, Geocoder } from '@ionic-native/google-maps';



@IonicPage()
@Component({
  selector: 'page-where',
  templateUrl: 'where.html',
})
export class WherePage {
  locations: Array<any> = [];
  hasActiveOrders: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public geolocation: Geolocation, public geocoder: Geocoder, public db: DatabaseProvider, public auth: AuthProvider, public loader: LoadingController, public menu: MenuController) {
    this.menu.enable(false);
    this.auth.getAuth().onAuthStateChanged((user) => {
      if(user){
        this.db.getMyOrders(this.auth.getUser().uid).subscribe((orders)=>{
          orders.forEach(order=>{
            if(order.status != 'rated'){
              this.hasActiveOrders = true;
            }
          });
        });
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WherePage');
    this.storage.getLocationsKeys().then((keys)=>{
      console.log(keys)
      keys.forEach((key)=>{
        if(key != "activeDirection"){
          this.storage.getByKey(key).then((location)=>{
            location.key = key;
            this.locations.push(location);
          });
        }
      });
    })
  }

  pushAddDirectionPage(){
    this.navCtrl.push(AddDirectionPage)
  }
  setCurrentLocation(){
    let loader = this.loader.create({
      content: 'Ubicandote...'
    })
    loader.present();
    this.geolocation.getCurrentPosition().then((position)=>{
      this.db.setPath('/prueba/actual', position);
      let myPosition: LatLng = new LatLng( position.coords.latitude,position.coords.longitude);
      this.geocoder.geocode({position: myPosition}).then((result)=>{
        console.log("Resultado", result);
        /* Android
        this.storage.saveDirection(result[0].extra.featureName,result[0].position.lat,result[0].position.lng, '');
        this.setLocation(result[0].extra.featureName);*/
        this.storage.saveDirection(result[0].extra.lines[0],result[0].position.lat,result[0].position.lng, '');
        this.setLocation(result[0].extra.lines[0]);
        loader.dismiss();
      });
    });

  }
  setLocation(key){
    this.storage.setActiveLocation(key).then(()=>{
      this.storage.getByKey('activeDirection').then((value)=>{
        console.log(value);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      });
    });
  }
  pushOrdersPage(){
    this.navCtrl.push(OrdersPage);
  }
}
