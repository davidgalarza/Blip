import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(private auth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
    
  }

  siginWithPhone(phoneNumber:string, applicationVerifier:any){
    return this.auth.auth.signInWithPhoneNumber(phoneNumber,applicationVerifier);
  }

}
