import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GeofireProvider } from '../geofire/geofire'
import * as moment from 'moment-timezone';

/*
  Generated class for the ShopFuntionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ShopFunctionsProvider {
  
  constructor(public http: Http, public geofire: GeofireProvider) {
    console.log('Hello ShopFuntionsProvider Provider');
  }
  getNearShops(lat:number, lng: number, category: string){
    this.geofire.getNearShopIds(lat, lng).then((nearShopsIds)=>{
      console.log(nearShopsIds);
    });
  }
  createCommerceData(commerce, category, distance, shopId, isSearch){
    return new Promise((resolve,reject)=>{
      let aux ={};
      let last;
      console.log("Ctegoria funciones:", category);
      console.log("Ctegoria funciones:", isSearch);
      console.log('Categoria val', commerce.val().category);
      if(commerce.val().category == category || isSearch){
        this.isOpen(commerce.val()).then(op =>{
          this.getDeliveryPrice(distance).then(price=>{
            aux['delivery_price'] = price;
            aux['name'] = commerce.val().name;
            aux['description'] = commerce.val().description;
            aux['commerceId'] = shopId;
            aux['bannerUrl'] = commerce.val().bannerUrl;
            aux['distance'] = distance;
            aux['isOpen'] = op;
            resolve(aux);
          });
        });
      }else{
        resolve({});
      }
    });
  }
  isOpen(commerce){
    return new Promise((resolve, resject)=>{
      let dateMoment = moment().tz("America/Bogota");
      let day;
      if(dateMoment.day() == 0){
        day = 6;
      }else{
        day = dateMoment.day()-1;
      }
      if(commerce.attention[day.toString()].work){
        let openS = commerce.attention[day.toString()].open;
        let closeS = commerce.attention[day.toString()].close;
        let open = moment().tz("America/Bogota").hour(Number(openS.split(':')[0])).minute(openS.split(':')[1]);
        let close = moment().tz("America/Bogota").hour(Number(closeS.split(':')[0])).minute(closeS.split(':')[1]);
        resolve(dateMoment.isBetween(open,close));
      }else{
        resolve(false);
      }
      
    });
  }

  getDeliveryPrice(distance){
    console.log(distance);
    return new Promise((resolve, reject)=>{
      let price;
      if(distance <= 3.5){
        price = 2.00;
      }else{
        if(distance <= 4.5){
          price = 2.50;
        }else{
          if(distance <= 5.5){
            price = 3.00;
          }
        }
      }
      resolve(price)
    });
  }
  
}
