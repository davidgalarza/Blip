/**
 * Page to select the delivery direction.
 */
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { AddDirectionPage } from '../../pages/add-direction/add-direction';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { HomePage } from '../../pages/home/home';
import { LatLng, Geocoder } from '@ionic-native/google-maps';



@IonicPage()
@Component({
  selector: 'page-where',
  templateUrl: 'where.html',
})
export class WherePage {
  locations: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public geolocation: Geolocation, public geocoder: Geocoder) {
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
    this.geolocation.getCurrentPosition().then((position)=>{
      let myPosition: LatLng = new LatLng( position.coords.latitude,position.coords.longitude);
      this.geocoder.geocode({position: myPosition}).then((result)=>{
        this.storage.saveDirection(result[0].extra.featureName,result[0].position.lat,result[0].position.lng, '');
        this.setLocation(result[0].extra.featureName);
      });
    });

  }
  setLocation(key){
    this.storage.setActiveLocation(key).then(()=>{
      this.storage.getByKey('activeDirection').then((value)=>{
        console.log(value);
      });
      this.navCtrl.push(HomePage);
    });
  }
}
