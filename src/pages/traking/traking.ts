import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Navbar } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { GeofireProvider } from '../../providers/geofire/geofire';
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
 * Generated class for the TrakingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traking',
  templateUrl: 'traking.html',
})
export class TrakingPage {
  @ViewChild(Navbar) navBar: Navbar;
  orderId:any;
  order:any = {};
  map: GoogleMap;
  bliperMarker
  bliperLat:any;
  bliperLng:any;
  bliperName:string;
  rate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, public googleMaps: GoogleMaps, public gf: GeofireProvider, public platform: Platform) {
    console.log(this.navParams.get('id'));
    if(this.navParams.get('origin') == 'page'){
      this.orderId = this.navParams.get('id');
    }else{
      this.orderId = JSON.parse(this.navParams.get('id').data).id;

    }
    console.log(this.orderId);
   
  }

  ionViewDidLoad() {
    if(this.navParams.get('origin') != 'page'){
      this.navBar.backButtonClick = () => {
        //Write here wherever you wanna do
         this.navCtrl.popToRoot();
      }
    }
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.popToRoot();
    });
  }

  ngAfterViewInit() {
    this.loadMap().then(()=>{
      this.db.getOrderById(this.orderId).subscribe(order=>{
        this.order = order;
        this.db.getBliper(this.order.bliper).subscribe((bliper)=>{
          this.bliperName = bliper.name;
        })
        console.log(this.order);
        if(this.order.status == 'inShop' || this.order.status == 'arrived' ){
          this.map.setVisible(true);
          console.log("Entro");
          this.db.getBliperPosition(this.order.bliper).subscribe(position=>{
            this.bliperLat = position[0].$value;
            this.bliperLng = position[1].$value;
            console.log(this.bliperLat);
            console.log(this.bliperLng);
            let myPosition: LatLng = new LatLng(this.bliperLat,this.bliperLng);
            this.bliperMarker.setPosition(myPosition);
            let positionC: CameraPosition = {
              target: myPosition,
              zoom: 18,
              tilt: 30
            };
            this.map.moveCamera(positionC);
          });
        }
        if(this.order.status == 'recived'){
          this.map.setVisible(false);
        }
      });
    });
  }

 

  loadMap(){
    return new Promise((resolve, reject)=>{
      let element: HTMLElement = document.getElementById('map');
      
      
           this.map = this.googleMaps.create(element);
        
          // create LatLng object
          let myPosition: LatLng = new LatLng(this.bliperLat,this.bliperLng);
        
          // create CameraPosition
          let position: CameraPosition = {
            target: myPosition,
            zoom: 18,
            tilt: 30
          };
      
          // move the map's camera to position
          
          let imageM = {
            url: 'www/assets/img/scooter.png',
            size: {
              width: 25,
              height: 25
            }
          };
          // Listen to Map events
          this.map.on(GoogleMapsEvent.MAP_READY).subscribe(()=>{
            console.log("Map ready")
            let markerShopOptions: MarkerOptions = {
              position: myPosition,
              title: "Bliper",
              icon: imageM
      
            };
            console.log(markerShopOptions);
            const markerBliper = this.map.addMarker(markerShopOptions).then(marker=>{
              this.bliperMarker = marker;
              resolve();
            });
            this.map.setVisible(false);
          });
      
          
    });
    // create a new map and marker div by passing HTMLElement
    
  }
  onModelChange(event){
    this.db.setOrderRate(this.orderId, this.rate).then(()=>{
      this.db.setOrderStatus(this.orderId, 'rated')
    });

  }
}
