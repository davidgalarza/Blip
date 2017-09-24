import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../../pages/list/list';
import { CustomPage } from '../../pages/custom/custom';
import { Firebase } from '@ionic-native/firebase';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { LatLng, Geocoder } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  grid: Array<any> =[];

  constructor(public navCtrl: NavController, private firebase: Firebase, public database: DatabaseProvider, public auth:AuthProvider,public nativeGeocoder: NativeGeocoder, public geocoder: Geocoder, public storage: StorageProvider) {
    this.firebase.onTokenRefresh().subscribe((token)=>{
      this.database.setUserToken(this.auth.getUser().uid, token);
    });
    this.storage.getByKey('activeDirection').then(key =>{
      this.storage.getByKey(key).then(location=>{
        let myPosition: LatLng = new LatLng( location.lat,location.lng);
        this.geocoder.geocode({
          position: myPosition
        }).then(position=>{
          console.log("Posicion",position[0].locality);
          console.log("To lower", position[0].locality.toLowerCase());
          this.database.getCategories(position[0].locality.toLowerCase()).subscribe(categories=>{
            this.grid = categories;
          });
        });
      });
    });
    

  }
  ionViewWillEnter(){
    this.firebase.setScreenName('home');
    this.firebase.logEvent('page_view', {page: "home"})
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));

  }
  pushCategory(category: string, display_name: string, search:  boolean){
    console.log(category);
    this.navCtrl.push(ListPage, {
      category: category,
      display_name: display_name,
      search: search
    });
  }
  pushCustomPage(){
    this.navCtrl.push(CustomPage);
  }
}