import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Scroll } from 'ionic-angular';
// Import pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { AutocompletePageModule } from '../pages/autocomplete/autocomplete.module';
import { WherePageModule } from '../pages/where/where.module';
import { AddDirectionPageModule } from '../pages/add-direction/add-direction.module';
import { MapPageModule } from '../pages/map/map.module';
import { ListPageModule } from '../pages/list/list.module';
import { ShopPageModule } from '../pages/shop/shop.module';
import { OptsPageModule } from '../pages/opts/opts.module';
import { CartPageModule } from '../pages/cart/cart.module';
import { CustomPageModule } from '../pages/custom/custom.module';
import { TrakingPageModule } from '../pages/traking/traking.module';
import { OrdersPageModule } from '../pages/orders/orders.module';
// Import AngularFire Library
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// Import Firebase Pligun
import { Firebase } from '@ionic-native/firebase'
//Native imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation'
import { Keyboard } from '@ionic-native/keyboard';;
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geocoder} from '@ionic-native/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
// Import ionic2-rating module


//Poviders
import { AuthProvider } from '../providers/auth/auth';
import { StorageProvider } from '../providers/storage/storage';
import { DatabaseProvider } from '../providers/database/database';
import { HttpProvider } from '../providers/http/http';
import { ShopFunctionsProvider } from '../providers/shop-functions/shop-functions';
import { GeofireProvider } from '../providers/geofire/geofire';
import { AlgoliaProvider } from '../providers/algolia/algolia';


// Components

// Firebase credentials      
export const firebaseConfig = {
    apiKey: "AIzaSyD5-GtfArEanLasYBxACCsKZCAwX_lQp3I",
    authDomain: "atiempo-5533e.firebaseapp.com",
    databaseURL: "https://atiempo-5533e.firebaseio.com",
    projectId: "atiempo-5533e",
    storageBucket: "atiempo-5533e.appspot.com",
    messagingSenderId: "212855483806"
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    WelcomePageModule,
    WherePageModule,
    AddDirectionPageModule,
    AutocompletePageModule,
    MapPageModule,
    ListPageModule,
    ShopPageModule,
    OptsPageModule,
    CartPageModule,
    CustomPageModule,
    TrakingPageModule,
    OrdersPageModule,
    HttpModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Firebase,
    HTTP,
    StorageProvider,
    Geolocation,
    Keyboard,
    GoogleMaps,
    NativeGeocoder,
    Geocoder,
    DatabaseProvider,
    HTTP,
    HttpProvider,
    ShopFunctionsProvider,
    GeofireProvider,
    AlgoliaProvider,
    Scroll
  ]
})
export class AppModule {}
