import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AutocompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompletePage {
  @ViewChild('myInput') myInput;  
  autocompleteItems;
  autocomplete;
  service = new (<any>window).google.maps.places.AutocompleteService();

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, public viewCtrl: ViewController) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
 
  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'EC'} }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AutocompletePage');
    window.setTimeout(() => {
      (<any>window).cordova.plugins.Keyboard.show();
      this.myInput.setFocus();
    }, 600); //SET A LONG TIME IF YOUR ARE IN A MODAL/ALERT
  }

}
