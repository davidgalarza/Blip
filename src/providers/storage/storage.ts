import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  saveDirection(adress: string, lat:number, lng:number, reference:string){
    let nDirections:string;
    this.storage.length().then((length)=>{
      nDirections = length.toString();
    });
    this.storage.set("d"+nDirections, {
      adress: adress,
      lat: lat,
      lng: lng,
      reference: reference
    });
  }
}
