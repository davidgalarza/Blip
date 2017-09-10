import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../../pages/list/list';
import { CustomPage } from '../../pages/custom/custom';
import { Firebase } from '@ionic-native/firebase';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  grid: Array<any> =[];

  constructor(public navCtrl: NavController, private firebase: Firebase, public database: DatabaseProvider, public auth:AuthProvider) {
    this.firebase.onTokenRefresh().subscribe((token)=>{
      this.database.setUserToken(this.auth.getUser().uid, token);
    });
    this.database.getCategories().subscribe(categories=>{
      this.grid = categories;
    });
    
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
