import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the AddrefPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addref',
  templateUrl: 'addref.html',
})
export class AddrefPage {
  @ViewChild('input') myInput ;
  reference: string = "";
  tag: string = "";
  featureName: string;
  lat:number;
  lng: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private storage: StorageProvider) {
    this.featureName = this.navParams.get('featureName');
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddrefPage');
  }
  ionViewLoaded() {

    setTimeout(() => {
      this.myInput.setFocus();
    },150);

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
  setLocation(key) {
    this.storage.setActiveLocation(key).then(() => {
      this.storage.getByKey('activeDirection').then((value) => {
        console.log(value);
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      });
    });
  }

  save(){
    this.storage.saveDirection(this.featureName, this.lat, this.lng, this.reference, this.tag);
    this.setLocation(this.featureName);
  }

}
