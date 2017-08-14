import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Module that manage the auth state of the user
 */

@Injectable()
export class AuthProvider {

  constructor(private auth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
    this.auth.auth.onAuthStateChanged
  }

  signinWithToken(token:string){
    return this.auth.auth.signInWithCustomToken(token);
  }
  getAuth(){
    return this.auth.auth;
  }
 
}
