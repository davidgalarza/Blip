import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as GeoFire from 'geofire';
import { DatabaseProvider } from '../database/database'
/*
  Generated class for the GeofireProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GeofireProvider {
  commercesLocations = new GeoFire(this.db.getCommercesLocationsRef());
  blipersPositions = new GeoFire(this.db.getBlipersPositionRef());
  MAX_DISTANCE: number = 3.5;
  constructor(public http: Http, public db: DatabaseProvider) {
    console.log('Hello GeofireProvider Provider');
  }
  
  //Functions

  onReady(geoQuery){  //Wait for ready event on a geoQuery
    return new Promise((resolve, reject)=>{
      geoQuery.on("ready", ()=>{
        resolve();
      });
    });
  }

  getNearShopIds(lat: number, lng: number){
    return new Promise<Array<any>|Error>((resolve, reject)=>{
      let nearShopsIds: Array<Array<any>> = [];
      let geoQuery = this.commercesLocations.query({
        center: [lat, lng],
        radius: this.MAX_DISTANCE
      });
      geoQuery.on("key_entered", (commerceId)=>{
        nearShopsIds.push(commerceId);
      });
      this.onReady(geoQuery).then(()=>{
        resolve(nearShopsIds);
      });
    });
  }
  distanceBetwen(lat1:number, lng1: number, lat2: number, lng2: number){
    return new Promise((resolve, reject)=>{
      resolve(GeoFire.distance([lat1, lng1], [lat2,lng2]))
    }); 
  }

}
