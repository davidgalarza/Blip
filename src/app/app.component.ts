import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, Menu } from 'ionic-angular';
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
import { ReferPage } from '../pages/refer/refer';
import { CreditsPage } from '../pages/credits/credits';
import { AddrefPage } from '../pages/addref/addref';
import { CartmPage } from '../pages/cartm/cartm';
//declare var handleBranch;

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
  rewards: number = 0;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthProvider, public db: DatabaseProvider) {
    this.initializeApp();
    this.zone = new NgZone({});
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Pedidos activos', component: OrdersPage, icon:'md-list' },
      { title: 'Gana $$', component: ReferPage, icon:'star' },
      {title: 'Cerrar sesión', component: null, icon:'md-log-out'}
    ];
    this.platform.ready().then(() => { 
      this.splashScreen.hide() 
      handleBranch();
      
    });
    this.platform.resume.subscribe(() => {
      handleBranch();
    });
    // Branch initialization
    const handleBranch = () => {
      var self = this;
      // only on devices
      if (!platform.is('cordova')) { return }
      const Branch = window['Branch'];
      Branch.initSession(data => {
        if (data['+clicked_branch_link']) {
          // read deep link data on click
          console.log('Deep Link Data: ' + JSON.stringify(data));
        }
      });
      Branch.setDebug(true);
      this.auth.getAuth().onAuthStateChanged((user) => {
        if(user){
          setTimeout(()=>{
            Branch.loadRewards().then(function (res) {
              console.log('Response: ' + res)
              self.rewards = res / 100;
        
            }).catch(function (err) {
              console.log('Error: ' + err)
            });
          },1500)
        }
      });
    }
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
      this.zone.run( () => {
        if (!user) {
          this.rootPage = WelcomePage;
          unsubscribe();
        } else { 
          this.rootPage = WherePage;
          unsubscribe();
        }
      });
     /*this.zone.run( () => {
        if (!user) {
          this.rootPage = CartmPage;
          unsubscribe();
        } else { 
          this.rootPage = CartmPage;
          unsubscribe();
        }
      });*/
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
      //this.nav.setRoot(page.component);
      this.nav.push(page.component);
  } else {
      // Since the component is null, this is the logout option
      // ...
      this.auth.logout();
      
      // redirect to home
      //this.nav.setRoot(WelcomePage);
      this.nav.setRoot(WelcomePage);

  }
  }
  pushCreditsPage(){
      this.nav.push(CreditsPage);
  }
}
