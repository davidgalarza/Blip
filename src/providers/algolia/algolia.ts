import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as algoliasearch from 'algoliasearch';

/*
  Generated class for the AlgoliaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AlgoliaProvider {
  algolia = algoliasearch('Q3TYY6N0YB', 'b81997f7441d5cdd8c5f080778697a81');
  constructor(public http: Http) {
    console.log('Hello AlgoliaProvider Provider');
    
  }

  searchShops(text: string, lat: number, lng: string){
      let shop = this.algolia.initIndex('shops');
      return shop.search({
        query: text,
        aroundLatLng: lat.toString() + ',' + lng.toString(),
        aroundRadius: 3500
      });
  }
  serchProducts(text: string, uid: string){
    let products = this.algolia.initIndex('products');
    products.setSettings({
      'attributesForFaceting': ['commerceId']
    })
    return products.search({
      query: text,
      filters: "commerceId:" + uid
    });
  }

}
