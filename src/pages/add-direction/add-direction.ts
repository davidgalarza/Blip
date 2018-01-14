/**
 * Page to create a new Location.
 * Author: Blip
 */

import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AutocompletePage } from '../../pages/autocomplete/autocomplete';
import { MapPage } from '../../pages/map/map';



@IonicPage()
@Component({
  selector: 'page-add-direction',
  templateUrl: 'add-direction.html',
})
export class AddDirectionPage {
  @ViewChild('myInput') myInput;  // Select Reference Input

  address: string = "";
  reference: string = "";
  tag: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private zone: NgZone, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDirectionPage');
    if(this.address.length > 0){
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
      this.address = data;
    });
    modal.present();
  }
  locateAdress(){
    this.navCtrl.push(MapPage, {
      address: this.address,
      reference: this.reference,
      tag: this.tag
    });
  }
  setTag(tag){
    this.tag = tag;
  }
  prompt(){
    let alert = this.alertCtrl.create({
      title: 'Nombre de Tag',
      message: 'Dale un nombre al tag de tu dirección',
      inputs: [
        {
          name: 'tag',
          placeholder: 'Nombre tag'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Guardar',
          handler: data => {
            console.log(data)
            this.tag = data.tag;
          }
        }
      ]
    });
    alert.present();
  }
}
