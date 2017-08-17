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

  getCommerces(){
    return this.db.database.ref().child('commercesLocations').ref
  }

}
