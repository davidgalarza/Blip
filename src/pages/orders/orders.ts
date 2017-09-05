import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { TrakingPage } from '../../pages/traking/traking'

import  moment from 'moment';

/**
 * Generated class for the OrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  myOrders:Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DatabaseProvider, public auth: AuthProvider) {
    this.db.getMyOrders(this.auth.getUser().uid).subscribe(orders=>{
      this.myOrders = [];
      orders.forEach(order=>{
        if(order.status != 'recived'){
          this.myOrders.push(order);
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }
  pushOrder(key){
    this.navCtrl.push(TrakingPage,{
      id: key,
      origin: 'page'
    });
  }

}
