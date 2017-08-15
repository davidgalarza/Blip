import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  saveDirection(address: string, lat:number, lng:number, reference:string){
    return this.storage.keys().then((keys)=>{
      this.storage.set(address, {
        address: address,
        lat: lat,
        lng: lng,
        reference: reference
      }).then(()=>{
        this.storage.set("activeDirection", address).then(()=>{
          let direction;
          this.storage.get('activeDirection').then((activeDirection)=>{
            console.log(activeDirection);
            this.storage.get(activeDirection).then((res)=>{
              console.log(res);
            });
          });
        });
      }); 
    });
  }

  getLocationsKeys():any{
    let keysArray;
    return this.storage.keys();
  }
  getByKey(key: string){
    return this.storage.get(key);
  }
  setActiveLocation(key: string){
    return this.storage.set("activeDirection", key);
  }
}
