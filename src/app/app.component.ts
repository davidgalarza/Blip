import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { WherePage } from '../pages/where/where';
import { ShopPage } from '../pages/shop/shop';
import { OrdersPage } from '../pages/orders/orders';
import { AddDirectionPage } from '../pages/add-direction/add-direction';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = WelcomePage;
  rootPage: any;
  zone:NgZone;
  pages: Array<{title: string, component: any, icon: any}>;
  userName: string = "";
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthProvider, public db: DatabaseProvider) {
    this.initializeApp();
    this.zone = new NgZone({});
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage, icon:'md-planet' },
      { title: 'Pedidos activos', component: OrdersPage, icon:'md-list' },
      {title: 'Cerrar sesión', component: null, icon:'md-log-out'}
    ];
    this.platform.ready().then(() => { this.splashScreen.hide() });
    this.auth.getAuth().onAuthStateChanged((user) => {
      if(user){
        this.db.getUserName(user.uid).subscribe(us=>{
          this.userName = us.name;
        })
      }
    });

  }

  initializeApp() {

    // Listen to the auth state and toogling the root page.
    const unsubscribe = this.auth.getAuth().onAuthStateChanged((user) => {
      /*this.zone.run( () => {
        if (!user) {
          this.rootPage = WelcomePage;
          unsubscribe();
        } else { 
          this.rootPage = WherePage;
          unsubscribe();
        }
      });  */   
      this.zone.run( () => {
        if (!user) {
          this.rootPage = ShopPage;
          unsubscribe();
        } else { 
          this.rootPage = ShopPage;
          unsubscribe();
        }
      });
      });
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
   
    });
  }

  openPage(page) {
    if(page.component) {
      this.nav.setRoot(page.component);
  } else {
      // Since the component is null, this is the logout option
      // ...
      this.auth.logout();
      
      // redirect to home
      this.nav.setRoot(WelcomePage);
  }
  }
}
