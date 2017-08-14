import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker,
 Geocoder
} from '@ionic-native/google-maps';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  address: string;
  reference: string;
  map: GoogleMap;
  mLat: any;
  mLng: any;
  marker: Marker;
  constructor(public navCtrl: NavController, public navParams: NavParams,public geolocation: Geolocation,
    public googleMaps: GoogleMaps, public geocoder: Geocoder, public alert: AlertController) {
      this.address = this.navParams.get('address');
      this.reference = this.navParams.get('reference');
      console.log(this.address);
      console.log(this.reference);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.getPosition();
  }
  getPosition():any{
    this.geocoder.geocode({address: this.address}).then((result)=>{
      console.log(result);
      this.loadMap(result);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  loadMap(result: any){
    this.mLat = result[0].position.lat;
    this.mLng = result[0].position.lng;
    
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');
    let div: HTMLElement = document.createElement('div');

    this.map = this.googleMaps.create(element);

  
    // create LatLng object
    let myPosition: LatLng = new LatLng(this.mLat,this.mLng);
  
    // create CameraPosition
    let position: CameraPosition = {
      target: myPosition,
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position

    this.map.moveCamera(position);
    

  
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(()=>{
      element.appendChild(div).className = 'centerMarker';
      var newPosition: LatLng ;
      console.log('Map is ready!');

      this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(cameraPosition=>{
        newPosition = new LatLng(cameraPosition.target.lat, cameraPosition.target.lng); 
        this.geocoder.geocode({position: newPosition}).then(result=>{
          console.log(result[0]);
          this.address = result[0].extra.featureName;
        });
        
      });
      

      });



    this.map.setClickable(true);
    this.map.trigger(GoogleMapsEvent.CAMERA_MOVE);

  }


}
