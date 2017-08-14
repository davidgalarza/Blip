import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AutocompletePage } from '../../pages/autocomplete/autocomplete';
import { LocateAdressPage } from '../../pages/locate-adress/locate-adress';
import { MapPage } from '../../pages/map/map';

/**
 * Generated class for the AddDirectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-direction',
  templateUrl: 'add-direction.html',
})
export class AddDirectionPage {
  @ViewChild('myInput') myInput;  
  autocompleteItems;
  autocomplete;
  address;
  reference: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private zone: NgZone) {
    this.address = {
      place: '',
      reference: ''
    };
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDirectionPage');
    if(this.address.place.length > 0){
      window.setTimeout(() => {
        (<any>window).cordova.plugins.Keyboard.show();
        this.myInput.setFocus();
      }, 600); //SET A LONG TIME IF YOUR ARE IN A MODAL/ALERT
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
