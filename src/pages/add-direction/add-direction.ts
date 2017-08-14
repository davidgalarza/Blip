/**
 * Page to create a new Location.
 * Author: Blip
 */

import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AutocompletePage } from '../../pages/autocomplete/autocomplete';
import { MapPage } from '../../pages/map/map';



@IonicPage()
@Component({
  selector: 'page-add-direction',
  templateUrl: 'add-direction.html',
})
export class AddDirectionPage {
  @ViewChild('myInput') myInput;  // Select Reference Input

  address;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private zone: NgZone) {
    this.address = {
      place: '',
      reference: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDirectionPage');
    if(this.address.place.length > 0){
      window.setTimeout(() => {
        this.myInput.setFocus();
        (<any>window).cordova.plugins.Keyboard.show();
      }, 600); //Auto focus on reference after select Adress
    }
  }
  
  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
    });
    modal.present();
  }
  locateAdress(){
    this.navCtrl.push(MapPage, {
      address: this.address.place,
      reference: this.address.reference
    });
  }
}
