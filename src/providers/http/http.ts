import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';

/**
 * Provider for HTTP request.
 */

@Injectable()
export class HttpProvider {

  constructor(public http: HTTP) {
    console.log('Hello HttpProvider Provider');
  }
  getShops(lat, lng, category){
    return new Promise((resolve, reject)=>{
      this.http.get('https://us-central1-atiempo-5533e.cloudfunctions.net/getCommerces?lat='+ lat.toString() + '&lng=' + lng.toString() + '&category=' + category + '&max_distance=3.5', {},{}).then(shops=>{
        resolve(shops.data);
      })
    });  
  }
  createOrder(data){
    return new Promise((resolve, reject)=>{
      this.http.post('https://us-central1-atiempo-5533e.cloudfunctions.net/createNewOrder',data,{}).then(res=>{
        resolve(res);
      });
    });
  }

}
