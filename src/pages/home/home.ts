import { Component } from '@angular/core';
import { NavController, MenuController, Platform, LoadingController } from 'ionic-angular';
import { ListPage } from '../../pages/list/list';
import { WelcomePage } from '../../pages/welcome/welcome';
import { CustomPage } from '../../pages/custom/custom';
import { Firebase } from '@ionic-native/firebase';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { LatLng, Geocoder } from '@ionic-native/google-maps';
import { ReferPage } from '../../pages/refer/refer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  grid: Array<any> =[];
  address: string = "";
  constructor(public navCtrl: NavController, private firebase: Firebase, public database: DatabaseProvider, public auth:AuthProvider,public nativeGeocoder: NativeGeocoder, public geocoder: Geocoder, public storage: StorageProvider, public menu: MenuController, public platform: Platform, private load: LoadingController) {
    this.menu.enable(true);

    console.log("Listo=> ");
    this.firebase.getToken().then(token=>{
      console.log(token);
    });
    this.firebase.onTokenRefresh().subscribe((token)=>{
      console.log("Token: ", token);
      this.auth.getAuth().onAuthStateChanged(user=>{
        if(user){
          console.log("eNTRO ", user);
          this.database.setUserToken(this.auth.getUser().uid, token);
        }else{
          this.menu.enable(false);
        }
      }); 
    });
    if (this.platform.is('ios')) {
      this.firebase.grantPermission().then(ss=>{
        console.log("Permisions: ", ss);
      });
    }
    let loading = this.load.create({
      content: 'Danos un minuto...'
    });
    loading.present();
   
    this.storage.getByKey('activeDirection').then(key =>{
      this.storage.getByKey(key).then(location=>{
        this.address = location.address;
        let myPosition: LatLng = new LatLng( location.lat,location.lng);
        this.geocoder.geocode({
          position: myPosition
        }).then(position=>{
          console.log("Posicion",position[0].locality);
          console.log("To lower", position[0].locality.toLowerCase());
          this.database.getCategories(position[0].locality.toLowerCase()).subscribe(categories=>{
            this.grid = categories;
            loading.dismiss();
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
    this.menu.enable(true);
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
  verifyAuth(){
    this.auth.getAuth().onAuthStateChanged(user=>{
      if(!user){
        this.menu.close().then(()=>{
          this.navCtrl.push(WelcomePage,{
            message: "Primero debes iniciar sesión",
          });
        });
      }
    });
  }
  pushReferPage(){
    this.navCtrl.push(ReferPage);
  }
}
