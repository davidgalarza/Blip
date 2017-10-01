import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase) {
    console.log('Hello DatabaseProvider Provider');
  }

  getCommerceMenus(uid:string){
    return this.db.list('/commerces/' + uid + '/menus');
  }
  getProducts(uid:string){
    return this.db.list('/products/', {
      query: {
        orderByChild: 'commerceId',
        equalTo: uid 
      }
    });
  }
  getCommercesLocationsRef(){
    return this.db.database.ref('commercesLocations').ref;
  }
  getBlipersPositionRef(){
    return this.db.database.ref('blipersLocations').ref;
  }
  
  getCommerById(id: string){

      return this.db.database.ref('/commerces/'+id)

  }
  createFirstUserData(uid:string, phone:string){
    return this.db.database.ref('users/'+uid+ '/phone').set(phone);
  }

  updateBilligInfoOfUser(uid:string, info:any){
    return this.db.database.ref('users/'+uid+'/billing').set(info);
  }

  getUser(uid:string){
    return this.db.database.ref('users/'+uid);
  }
  getOrderById(id){
    return this.db.object('/orders/'+id);
   }
   getBliperPosition(id){
    return this.db.list('/blipersLocations/'+id+'/l');
  }
  setUserToken(id, token){
    return this.db.database.ref('/users/'+id+'/token').set(token)
  }
  setUserBilling(id, billingInfo){
    return this.db.database.ref('/users/'+id+'/billing').set(billingInfo)
  }
  getBliper(id){
    return this.db.object('/blipers/'+id);
  }
  getMyOrders(uid){
    return this.db.list('/orders/', {
      query:{
        orderByChild: 'userId',
        equalTo:uid
      }
    })
  }
  setOrderStatus(id, status){
    return this.db.database.ref('orders/'+ id+'/status').set(status)
  }
  setOrderRate(id, rate){
    return this.db.database.ref('orders/'+ id+'/rate').set(rate);
  }
  getCategories(city: string){
    return this.db.list('/cities/'+city+'/categories');
  }
  setPath(path, value){
    this.db.database.ref(path).set(value);
  }
}
